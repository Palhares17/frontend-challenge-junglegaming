import { expect, test } from '@playwright/test';

const originalUrl = '/?q=&collections=%5B%22digital-art%22%5D&networks=%5B%5D&min=2&max=1230&sort=recent&tab=all&page=1';
const loadMessage = 'Não foi possível carregar a página. Tente novamente.';

for (const width of [390, 768, 1440]) {
  test(`reported URL loads, refreshes and navigates without document reload at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const documents: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents.push(request.url());
    });
    await page.goto(originalUrl);
    await expect(page.getByTestId('nft-card')).toHaveCount(9);
    await page.reload();
    await expect(page.getByTestId('nft-card')).toHaveCount(9);
    await expect(page).toHaveURL(originalUrl);
    const documentCount = documents.length;
    await page.getByRole('link', { name: 'Ver Emerald Ape #042', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Emerald Ape #042', exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByTestId('nft-card')).toHaveCount(9);
    expect(documents).toHaveLength(documentCount);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [390, 1440]) {
  test(`catalog failure uses one toast, keeps controls and recovers at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => localStorage.setItem('kurio:mock-scenario', 'error'));
    await page.goto(originalUrl);
    const alert = page.getByRole('alert');
    await expect(alert).toHaveText(loadMessage);
    await expect(alert).toHaveCount(1);
    await expect(alert).toHaveAttribute('aria-live', 'assertive');
    await expect(page.getByRole('button', { name: 'Em alta', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Não foi possível carregar os NFTs' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
    await expect(alert).toHaveText(loadMessage);
    await expect(alert).toHaveCount(1);
    await page.evaluate(() => localStorage.removeItem('kurio:mock-scenario'));
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
    await expect(page.getByTestId('nft-card')).toHaveCount(9);
    await expect(alert).toHaveCount(0);
  });

  for (const mode of ['login', 'register']) {
    test(`${mode} remains usable during catalog failure at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(() => localStorage.setItem('kurio:mock-scenario', 'error'));
      await page.goto(`/${mode}?redirect=%2Faccount%2Fprofile`);
      await expect(page.getByLabel(/^E-mail/)).toBeVisible();
      await expect(page.getByLabel(/^Senha/).first()).toBeVisible();
      if (mode === 'login') {
        await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
        await page.getByLabel(/^Senha/).fill('Kurio123!');
        await page.getByRole('button', { name: 'Entrar', exact: true }).click();
        await expect(page).toHaveURL(/\/account\/profile$/);
        await expect(page.getByLabel(/^E-mail/)).toHaveValue('ana@kurio.test');
        await expect(page.getByRole('alert')).toHaveCount(0);
      }
    });
  }
}

for (const path of ['/nfts/nft-1', '/cart']) {
  test(`${path} outage shows toast and standard navigation, then retry recovers`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('kurio:navigation-scenario', 'error'));
    await page.goto(path);
    await expect(page.getByRole('alert')).toHaveText(loadMessage);
    await expect(page.getByRole('heading', { name: 'Não foi possível carregar a página', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Kurio — início' }).first()).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('kurio:navigation-scenario'));
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
    await expect(page.getByRole('heading', { name: path === '/cart' ? 'Carrinho de NFTs' : 'Emerald Ape #042', exact: true })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}

test('leaving a failed route clears its toast and 404 stays distinct', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kurio:navigation-scenario', 'error'));
  await page.goto('/nfts/nft-1');
  await expect(page.getByRole('alert')).toHaveText(loadMessage);
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click();
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.evaluate(() => localStorage.removeItem('kurio:navigation-scenario'));
  await page.goto('/nfts/missing');
  await expect(page.getByRole('heading', { name: 'Recurso não encontrado' })).toBeVisible();
  await expect(page.getByText(loadMessage, { exact: true })).toHaveCount(0);
});

test('failed catalog refresh retains valid cards and retries the actual updated data', async ({ page }) => {
  await page.goto(originalUrl);
  const cards = page.getByTestId('nft-card');
  await expect(cards).toHaveCount(9);
  await expect(cards.first()).toContainText('1.19 ETH');
  await page.evaluate(async () => {
    localStorage.setItem('kurio:mock-scenario', 'error');
    // A real MSW inventory event makes the active catalog reconcile via REST.
    const response = await fetch('/api/mock/nfts/nft-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: '2.19' }),
    });
    if (!response.ok) throw new Error('Inventory control failed');
  });
  await expect(page.getByRole('alert')).toHaveText(loadMessage);
  await expect(cards).toHaveCount(9);
  await expect(cards.first()).toContainText('1.19 ETH');
  await page.evaluate(() => localStorage.removeItem('kurio:mock-scenario'));
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(cards.first()).toContainText('2.19 ETH');
  await expect(page.getByRole('alert')).toHaveCount(0);
});
