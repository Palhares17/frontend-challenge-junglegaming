import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import axios from 'axios';
import { handlers } from './handlers';
import { databaseKey, sessionKey, readDatabase, useMockStorage, writeDatabase } from './database';
import { advanceOrders } from './orders';

const saved = new Map<string, string>();
const storage = { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => { saved.set(key, value); }, removeItem: (key: string) => { saved.delete(key); } };
const server = setupServer(...handlers);
const api = axios.create({ baseURL: 'http://localhost/api', validateStatus: () => true });
const item = { nftId: 'nft-1', editionId: 'ten', quantity: 2 };
const walletInput = { label: 'Principal', network: 'ethereum', address: `0x${'a'.repeat(40)}`, primary: true };
const credentials = { email: 'ana@kurio.test', password: 'Kurio123!' };
const login = async (email = credentials.email, password = credentials.password) => api.post('/session', { email, password });
const reset = async (preset = 'default') => api.post('/mock/reset', { preset });
async function purchaseSetup(scenario = 'order-pending') {
  await login();
  const wallet = (await api.post('/wallets', walletInput)).data;
  await api.post('/wallet-connection', { walletId: wallet.id, network: 'ethereum' });
  await api.post('/cart/items', item);
  const quote = (await api.post('/quotes')).data;
  await api.put('/mock/scenario', { scenario });
  return { quoteId: quote.id, walletId: wallet.id, network: 'ethereum', collector: { displayName: 'Ana', email: credentials.email } };
}
const order = (body: unknown, key = 'attempt-123456') => api.post('/orders', body, { headers: { 'Idempotency-Key': key } });
beforeAll(() => { useMockStorage(storage); server.listen({ onUnhandledFrame: 'error' }); });
afterAll(() => { server.close(); useMockStorage(undefined); });
beforeEach(async () => { saved.clear(); await reset(); });

describe('shared persisted MSW data and account boundaries', () => {
  it('keeps the original catalog and restores default/populated without clearing unrelated keys', async () => {
    saved.set('unrelated', 'keep');
    await reset('populated');
    expect((await api.get('/cart')).data.items[0].quantity).toBe(2);
    await login();
    expect((await api.get('/wallets')).data.items).toHaveLength(1);
    await reset();
    expect((await api.get('/cart')).data.items).toEqual([]);
    expect((await api.get('/session')).data.user).toBeNull();
    expect(saved.get('unrelated')).toBe('keep');
    expect((await api.get('/nfts')).data.total).toBe(239);
  });
  it('creates an account, validates conflicts, and never persists cleartext passwords', async () => {
    const input = { username: 'carol', email: 'CAROL@kurio.test', password: 'Secret123!', confirmPassword: 'Secret123!' };
    expect((await api.post('/accounts', { ...input, confirmPassword: 'wrong' })).status).toBe(422);
    expect((await api.post('/accounts', input)).status).toBe(201);
    expect((await api.post('/accounts', input)).status).toBe(409);
    expect((await login('carol@kurio.test', input.password)).status).toBe(200);
    expect(JSON.stringify([...saved.values()])).not.toContain(input.password);
    expect((await api.get('/profile')).data.username).toBe('carol');
  });
  it('merges guest quantities once and keeps accounts/carts/favorites isolated after logout', async () => {
    await api.post('/cart/items', item);
    await login();
    await api.put('/favorites/nft-1');
    await api.delete('/session');
    expect((await api.get('/cart')).data.items).toHaveLength(0);
    await login('bruno@kurio.test');
    expect((await api.get('/cart')).data.items).toHaveLength(0);
    expect((await api.get('/favorites')).data.items).toHaveLength(0);
    expect((await api.get('/orders/demo-confirmed')).status).toBe(404);
    await login();
    expect((await api.get('/cart')).data.items[0].quantity).toBe(2);
    expect((await api.get('/favorites')).data.items).toHaveLength(1);
  });
  it('preserves visitor items if session persistence or the cart merge fails', async () => {
    await api.post('/cart/items', item);
    for (const failingKey of [sessionKey, databaseKey]) {
      useMockStorage({ ...storage, setItem: (key, value) => {
        if (key === failingKey) throw new Error('quota');
        storage.setItem(key, value);
      } });
      expect((await login()).data.code).toBe('MOCK_STORAGE_ERROR');
      useMockStorage(storage);
      expect((await api.get('/session')).data.user).toBeNull();
      expect((await api.get('/cart')).data.items[0].quantity).toBe(2);
    }
  });
  it('disconnects the simulated wallet on logout and on a new login', async () => {
    await purchaseSetup();
    expect((await api.get('/checkout')).data.connection.status).toBe('connected');
    await api.delete('/session');
    await login();
    expect((await api.get('/checkout')).data.connection).toBeNull();
  });
  it.each(['/profile', '/wallets', '/favorites', '/checkout', '/orders/demo-confirmed'])('protects %s without a session', async (url) => {
    expect((await api.get(url)).status).toBe(401);
  });
  it('persists profile/avatar/password and validates address by network', async () => {
    await login();
    expect((await api.patch('/profile', { email: 'wrong' })).status).toBe(422);
    expect((await api.patch('/profile', { email: 'bruno@kurio.test' })).status).toBe(409);
    await api.patch('/profile', { displayName: 'Ana Nova', ens: 'ana.eth' });
    const avatar = 'data:image/png;base64,aGVsbG8=';
    expect((await api.put('/profile/avatar', { avatar })).status).toBe(200);
    expect((await api.put('/profile/avatar', { avatar: 'javascript:alert(1)' })).status).toBe(422);
    expect((await api.get('/profile')).data.avatar).toBe(avatar);
    await api.put('/profile/avatar', { avatar: null });
    expect((await api.put('/profile/password', { currentPassword: 'wrong', password: 'Newpass123!', confirmPassword: 'Newpass123!' })).status).toBe(422);
    expect((await api.put('/profile/password', { currentPassword: credentials.password, password: 'Newpass123!', confirmPassword: 'Newpass123!' })).status).toBe(204);
    await api.delete('/session');
    expect((await login()).status).toBe(401);
    expect((await login(credentials.email, 'Newpass123!')).data.user.name).toBe('Ana Nova');
    expect((await api.post('/wallets', { ...walletInput, network: 'solana' })).status).toBe(422);
    const wallet = (await api.post('/wallets', walletInput)).data;
    expect((await api.patch(`/wallets/${wallet.id}`, { label: 'Renomeada' })).data.label).toBe('Renomeada');
    await api.post('/wallets', { label: 'Solana', address: 'So11111111111111111111111111111111111111112', network: 'solana', primary: true });
    expect((await api.get('/wallets')).data.items.filter((entry: { primary: boolean }) => entry.primary)).toHaveLength(1);
    expect((await api.post('/wallets', { ...walletInput, address: `0x${'b'.repeat(40)}` })).status).toBe(409);
    expect(saved.get(databaseKey)).not.toContain('Newpass123!');
  });
  it('rejects malformed JSON and reports corrupt or unwritable storage without claiming success', async () => {
    expect((await api.post('/accounts', '{', { headers: { 'Content-Type': 'application/json' }, transformRequest: [(value) => value] })).status).toBe(400);
    saved.set(databaseKey, '{broken');
    expect((await api.get('/nfts')).data.code).toBe('MOCK_STORAGE_ERROR');
    expect((await reset()).status).toBe(200);
    useMockStorage({ ...storage, setItem: () => { throw new Error('quota'); } });
    expect((await api.post('/cart/items', item)).data.code).toBe('MOCK_STORAGE_ERROR');
    useMockStorage(storage);
    expect((await api.get('/cart')).data.items).toHaveLength(0);
  });
});

describe('cart, inventory and exact authoritative quotes', () => {
  it('updates/removes lines and rejects unavailable editions/noninteger quantities', async () => {
    expect((await api.post('/cart/items', { ...item, quantity: 0.5 })).status).toBe(422);
    expect((await api.post('/cart/items', { ...item, editionId: 'missing' })).status).toBe(422);
    expect((await api.post('/cart/items', { ...item, editionId: 'single' })).status).toBe(409);
    await api.post('/cart/items', item);
    expect((await api.patch('/cart/items/nft-1:ten', { quantity: 3 })).data.items[0].quantity).toBe(3);
    expect((await api.patch('/cart/items/nft-1:ten', { quantity: 11 })).status).toBe(409);
    expect((await api.get('/cart')).data.items[0].quantity).toBe(3);
    expect((await api.delete('/cart/items/nft-1:ten')).data.items).toHaveLength(0);
  });
  it('keeps all 18 ETH decimals, rounds discounts down in wei and validates/removes coupons', async () => {
    await api.patch('/mock/nfts/nft-1', { price: '0.123456789012345679' });
    await api.post('/cart/items', { ...item, quantity: 1 });
    expect((await api.post('/cart/coupon', { code: 'invalid' })).data.code).toBe('COUPON_INVALID');
    expect((await api.post('/cart/coupon', { code: 'toString' })).data.code).toBe('COUPON_INVALID');
    expect((await api.post('/cart/coupon', { code: 'EXPIRED' })).data.code).toBe('COUPON_EXPIRED');
    const totals = (await api.post('/cart/coupon', { code: 'kurio10' })).data.totals;
    expect(totals).toEqual({ subtotal: '0.123456789012345679', discount: '0.012345678901234567', networkFee: '0.01', total: '0.121111110111111112' });
    expect((await api.delete('/cart/coupon')).data.totals.discount).toBe('0.00');
  });
  it.each(['price', 'stock', 'fee', 'coupon', 'cart', 'expiration'])('rejects an old quote after %s changes', async (change) => {
    const input = await purchaseSetup();
    if (change === 'price') await api.patch('/mock/nfts/nft-1', { price: '2.00' });
    if (change === 'stock') await api.patch('/mock/nfts/nft-1', { editions: [{ id: 'ten', available: 0 }] });
    if (change === 'fee') await api.patch('/mock/fees', { networkFee: '0.02' });
    if (change === 'cart') await api.patch('/cart/items/nft-1:ten', { quantity: 3 });
    if (change === 'coupon') await api.post('/cart/coupon', { code: 'KURIO10' });
    if (change === 'expiration') { const db = readDatabase(); db.quotes[input.quoteId].expiresAt = 0; writeDatabase(db); }
    const response = await order(input);
    expect(response.status).toBe(409);
    expect(response.data.code).toBe('QUOTE_CHANGED');
    expect(Object.keys(readDatabase().attempts)).toHaveLength(0);
  });
  it('revalidates an applied coupon after expiration and enforces connection/review network', async () => {
    await login();
    expect((await api.post('/quotes')).data.code).toBe('EMPTY_CART');
    const input = await purchaseSetup();
    await api.post('/cart/coupon', { code: 'KURIO10' });
    await api.patch('/mock/coupons/KURIO10', { expired: true });
    expect((await api.post('/quotes')).data.code).toBe('COUPON_EXPIRED');
    await api.delete('/cart/coupon');
    input.quoteId = (await api.post('/quotes')).data.id;
    expect((await order({ ...input, network: 'polygon' })).data.code).toBe('NETWORK_MISMATCH');
    await api.delete('/wallet-connection');
    expect((await order(input)).data.code).toBe('WALLET_DISCONNECTED');
  });
});

describe('idempotent orders, reservations and immutable receipts', () => {
  it('returns the same order for retries/concurrent duplicate clicks and conflicts on a different payload', async () => {
    const input = await purchaseSetup();
    const results = await Promise.all([order(input), order(input)]);
    expect(results.map((response) => response.status).sort()).toEqual([200, 201]);
    expect(results[0].data.id).toBe(results[1].data.id);
    expect((await order({ ...input, collector: { ...input.collector, displayName: 'Outra' } })).data.code).toBe('IDEMPOTENCY_CONFLICT');
    expect(readDatabase().nfts[0].editions[1].available).toBe(8);
    expect((await api.post('/orders', input)).status).toBe(422);
  });
  it('recovers a pending order after reload/time, consumes purchased quantities once and freezes the receipt', async () => {
    const input = await purchaseSetup();
    const first = (await order(input)).data;
    await api.post('/cart/items', { ...item, quantity: 1 });
    await api.patch('/mock/nfts/nft-1', { price: '9.00' });
    const db = readDatabase(); db.orders[first.id].settleAt = Date.now() - 1; writeDatabase(db);
    advanceOrders();
    const confirmed = (await api.get(`/orders/${first.id}`)).data;
    expect(confirmed.status).toBe('confirmed');
    expect(confirmed.receipt.totals.total).toBe('2.39');
    expect((await api.get('/cart')).data.items[0].quantity).toBe(1);
    await api.post(`/mock/orders/${first.id}/settle`, { status: 'declined' });
    expect((await api.get(`/orders/${first.id}`)).data).toEqual(confirmed);
    expect((await order(input)).data).toEqual(confirmed);
    await login('bruno@kurio.test');
    expect((await api.get(`/orders/${first.id}`)).status).toBe(404);
  });
  it('declines without consuming cart and releases reservations once', async () => {
    const input = await purchaseSetup('payment-declined');
    const first = (await order(input)).data;
    expect(readDatabase().nfts[0].editions[1].available).toBe(8);
    advanceOrders(Date.now() + 2100);
    expect((await api.get(`/orders/${first.id}`)).data.status).toBe('declined');
    expect((await api.get('/cart')).data.items[0].quantity).toBe(2);
    expect(readDatabase().nfts[0].editions[1].available).toBe(10);
    await api.post(`/mock/orders/${first.id}/settle`, { status: 'confirmed' });
    expect((await api.get(`/orders/${first.id}`)).data.status).toBe('declined');
    expect(readDatabase().nfts[0].editions[1].available).toBe(10);
  });
  it('persists the attempt before a timeout so retry returns the same order', async () => {
    const input = await purchaseSetup('timeout-after-create');
    await expect(orderWithTimeout(input)).rejects.toMatchObject({ code: 'ECONNABORTED' });
    const response = await order(input);
    expect(response.status).toBe(200);
    expect(Object.keys(readDatabase().attempts)).toHaveLength(1);
    expect(readDatabase().nfts[0].editions[1].available).toBe(8);
  });
});
function orderWithTimeout(input: unknown) { return api.post('/orders', input, { timeout: 400, headers: { 'Idempotency-Key': 'attempt-123456' } }); }

describe('deterministic network conditions and recovery', () => {
  it.each([['validation', 422], ['conflict', 409], ['forbidden', 403], ['error', 503]])('returns %s and recovers', async (scenario, status) => {
    await api.put('/mock/scenario', { scenario });
    expect((await api.post('/cart/items', item)).status).toBe(status);
    await api.put('/mock/scenario', { scenario: 'default' });
    expect((await api.post('/cart/items', item)).status).toBe(201);
  });
  it('simulates network errors and session expiration through MSW', async () => {
    await login();
    await api.put('/mock/scenario', { scenario: 'offline' });
    await expect(api.get('/cart')).rejects.toBeDefined();
    await api.put('/mock/scenario', { scenario: 'session-expired' });
    expect((await api.get('/profile')).status).toBe(401);
    expect((await api.get('/session')).data.user).toBeNull();
    await api.put('/mock/scenario', { scenario: 'default' });
    expect((await login()).status).toBe(200);
  });
  it('supports a global empty catalog and a deterministic request timeout', async () => {
    await api.put('/mock/scenario', { scenario: 'empty' });
    expect((await api.get('/nfts')).data.items).toEqual([]);
    await api.put('/mock/scenario', { scenario: 'timeout' });
    await expect(api.get('/cart', { timeout: 300 })).rejects.toMatchObject({ code: 'ECONNABORTED' });
    await api.put('/mock/scenario', { scenario: 'default' });
    expect((await api.get('/nfts')).data.total).toBe(239);
  });
  it('simulates a refused wallet connection and recovers', async () => {
    await login();
    const wallet = (await api.post('/wallets', walletInput)).data;
    await api.put('/mock/scenario', { scenario: 'wallet-rejected' });
    expect((await api.post('/wallet-connection', { walletId: wallet.id, network: 'ethereum' })).data.code).toBe('WALLET_REJECTED');
    await api.put('/mock/scenario', { scenario: 'default' });
    expect((await api.post('/wallet-connection', { walletId: wallet.id, network: 'ethereum' })).data.status).toBe('connected');
  });
});
