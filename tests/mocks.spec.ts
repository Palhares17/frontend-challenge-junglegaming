import { expect, test, type Page } from '@playwright/test';

async function request(page: Page, method: string, url: string, data?: unknown, headers?: Record<string, string>, timeout?: number) {
  return page.evaluate(async (input) => {
    const path = '/src/core/services/api/api.ts';
    const { api } = await import(path);
    try {
      const response = await api.request({ ...input, validateStatus: () => true });
      return { status: response.status as number, data: response.data, code: '' };
    } catch (error) { return { status: 0, data: null, code: (error as { code: string }).code }; }
  }, { method, url, data, headers, timeout });
}
async function ready(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('nft-card').first()).toBeVisible();
}
async function connect(page: Page, sessionId?: string) {
  await page.evaluate(async (id) => {
    const path = '/src/core/realtime/socket.ts';
    const { createMarketplaceSocket } = await import(path);
    const state = window as unknown as { mockSocket: import('socket.io-client').Socket; mockEvents: { name: string; payload: { resourceId: string; version: number; data: { status?: string; price?: string } } }[]; connects: number };
    state.mockSocket?.disconnect();
    state.mockEvents = [];
    state.connects = 0;
    const socket = createMarketplaceSocket(location.origin, id);
    state.mockSocket = socket;
    socket.onAny((name: string, payload: typeof state.mockEvents[number]['payload']) => state.mockEvents.push({ name, payload }));
    socket.on('connect', () => state.connects++);
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Socket.IO handshake did not complete')), 5000);
      socket.once('connect', () => { clearTimeout(timeout); resolve(); });
      socket.once('connect_error', (error: Error) => { clearTimeout(timeout); reject(error); });
        socket.connect();
    });
  }, sessionId);
}
async function events(page: Page) {
  return page.evaluate(() => (window as unknown as { mockEvents: { name: string; payload: { resourceId: string; version: number; data: { price?: string; status?: string } } }[] }).mockEvents);
}
const login = (page: Page, email = 'ana@kurio.test') => request(page, 'POST', '/session', { email, password: 'Kurio123!' });
async function purchase(page: Page, scenario = 'order-pending') {
  await request(page, 'POST', '/cart/items', { nftId: 'nft-1', editionId: 'ten', quantity: 2 });
  const wallet = (await request(page, 'POST', '/wallets', { label: 'Principal Ana', address: `0x${'a'.repeat(40)}`, network: 'ethereum', primary: true })).data;
  await request(page, 'POST', '/wallet-connection', { walletId: wallet.id, network: 'ethereum' });
  const quote = (await request(page, 'POST', '/quotes')).data;
  await request(page, 'PUT', '/mock/scenario', { scenario });
  const body = { quoteId: quote.id, walletId: wallet.id, network: 'ethereum', collector: { displayName: 'Ana', email: 'ana@kurio.test' } };
  return { body, headers: { 'Idempotency-Key': 'browser-attempt-123' } };
}

test('MSW state survives refresh, merges guest cart and is visible in product routes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await ready(page);
  await request(page, 'POST', '/mock/reset', { preset: 'populated' });
  const cart = await request(page, 'GET', '/cart');
  expect(cart.data.totals.total).toBe('2.39');
  await page.goto('/cart');
  await expect(page.getByRole('group', { name: 'Quantidade de Emerald Ape #042' }).getByRole('status')).toHaveText('2');
  await page.reload();
  await expect(page.getByRole('group', { name: 'Quantidade de Emerald Ape #042' }).getByRole('status')).toHaveText('2');
  expect((await request(page, 'GET', '/cart')).data.items[0].quantity).toBe(2);
  await login(page);
  await page.goto('/checkout');
  await expect(page.getByRole('combobox', { name: 'Carteira salva', exact: true })).toBeVisible();
  expect((await request(page, 'GET', '/cart')).data.items[0].quantity).toBe(2);
  await request(page, 'DELETE', '/session');
  await login(page, 'bruno@kurio.test');
  expect((await request(page, 'GET', '/cart')).data.items).toEqual([]);
  expect((await request(page, 'GET', '/orders/demo-confirmed')).status).toBe(404);
  await request(page, 'POST', '/mock/reset', {});
  await page.goto('/cart');
  await expect(page.getByText('Seu carrinho está vazio.', { exact: true })).toBeVisible();
});

test('socket.io-client receives the same nft state as REST, including duplicate and old events', async ({ page }) => {
  await ready(page);
  await connect(page);
  const response = await request(page, 'PATCH', '/mock/nfts/nft-1', { price: '2.123456789012345678', editions: [{ id: 'ten', available: 3 }] });
  expect(response.status).toBe(200);
  await expect.poll(async () => (await events(page)).filter((event) => event.name === 'nft.updated').length).toBe(1);
  const event = (await events(page))[0];
  expect(event.payload.data.price).toBe('2.123456789012345678');
  const detail = (await request(page, 'GET', '/nfts/nft-1')).data.nft;
  expect(detail.version).toBe(event.payload.version);
  expect(detail.editions.find((edition: { id: string }) => edition.id === 'ten').available).toBe(3);
  await request(page, 'POST', '/mock/events/replay', { name: 'nft.updated', resourceId: 'nft-1', mode: 'duplicate' });
  await request(page, 'POST', '/mock/events/replay', { name: 'nft.updated', resourceId: 'nft-1', mode: 'old' });
  await expect.poll(async () => (await events(page)).length).toBe(3);
  expect((await events(page)).map((entry) => entry.payload.version)).toEqual([2, 2, 1]);
  expect((await request(page, 'GET', '/nfts/nft-1')).data.nft.version).toBe(2);
});

test('Socket.IO reconnects to recover a pending order through REST and emits its terminal state', async ({ page }) => {
  await ready(page);
  const session = await login(page);
  await connect(page, session.data.sessionId);
  const { body, headers } = await purchase(page);
  const created = await request(page, 'POST', '/orders', body, headers);
  expect(created.status).toBe(201);
  const id = created.data.id;
  await expect.poll(async () => (await events(page)).some((event) => event.name === 'order.updated' && event.payload.resourceId === id)).toBe(true);
  await request(page, 'POST', '/mock/connection/disconnect');
  await expect.poll(() => page.evaluate(() => (window as unknown as { connects: number }).connects)).toBe(2);
  expect((await request(page, 'GET', `/orders/${id}`)).data.status).toBe('pending');
  await request(page, 'POST', `/mock/orders/${id}/settle`, { status: 'confirmed' });
  await expect.poll(async () => (await events(page)).some((event) => event.name === 'order.updated' && event.payload.resourceId === id && event.payload.data.status === 'confirmed')).toBe(true);
  await page.goto(`/orders/${id}/confirmation`);
  await expect(page.getByText(`0xkurio-simulated-${id}`, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(`0xkurio-simulated-${id}`, { exact: true })).toBeVisible();
});

test('a socket from the previous session closes and cannot receive the next account order', async ({ page }) => {
  await ready(page);
  const ana = await login(page);
  await connect(page, ana.data.sessionId);
  await request(page, 'DELETE', '/session');
  await login(page, 'bruno@kurio.test');
  await expect.poll(() => page.evaluate(() => (window as unknown as { mockSocket: { connected: boolean } }).mockSocket.connected)).toBe(false);
  // This account can own an Ethereum wallet as well as the other fixtures.
  const { body, headers } = await purchase(page);
  const created = await request(page, 'POST', '/orders', body, headers);
  expect(created.status).toBe(201);
  expect((await events(page)).filter((event) => event.name === 'order.updated')).toHaveLength(0);
});

test('Axios timeout after order creation retries the same attempt without a duplicate purchase', async ({ page }) => {
  await ready(page);
  await login(page);
  const { body, headers } = await purchase(page, 'timeout-after-create');
  const timedOut = await request(page, 'POST', '/orders', body, headers, 400);
  expect(timedOut.code).toBe('ECONNABORTED');
  const retried = await request(page, 'POST', '/orders', body, headers);
  expect(retried.status).toBe(200);
  const repeated = await request(page, 'POST', '/orders', body, headers);
  expect(repeated.data.id).toBe(retried.data.id);
  expect((await request(page, 'GET', '/nfts/nft-1')).data.nft.editions.find((edition: { id: string }) => edition.id === 'ten').available).toBe(8);
});
