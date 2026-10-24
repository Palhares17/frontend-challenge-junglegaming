import { expect, test, type Page } from '@playwright/test';

const cards = (page: Page) => page.getByTestId('nft-card');
const catalog = (page: Page) =>
  page.getByRole('region', { name: 'Catálogo de NFTs' });

for (const width of [390, 768, 1440]) {
  test(`home loads original artwork and fits ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(cards(page)).toHaveCount(9);
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.images) {
        image.loading = 'eager';
        await image.decode();
      }
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
    await expect(page).toHaveScreenshot(`home-${width}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });
}

test('pagination, combined filters, sort, refresh and history use the MSW API', async ({
  page,
}) => {
  await page.goto('/');
  await expect(cards(page)).toHaveCount(9);
  await page.getByRole('button', { name: 'Página 2', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Página 2', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(cards(page).first()).toContainText('Emerald Ape #010');
  await page.getByRole('checkbox', { name: 'Música', exact: false }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('checkbox', { name: 'Ethereum', exact: false }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('combobox', { name: 'Ordenar por' }).click();
  const sortedResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/nfts?') &&
      response.url().includes('sort=price-asc'),
  );
  await page.getByRole('option', { name: 'Menor preço', exact: true }).click();
  const response = await sortedResponse;
  const params = new URL(response.url()).searchParams;
  expect(params.getAll('collection')).toEqual(['digital-art', 'music']);
  expect(params.getAll('network')).toEqual(['ethereum']);
  expect(params.get('page')).toBe('1');
  const body = await response.json();
  expect(
    body.items.every(
      (item: { network: string }) => item.network === 'ethereum',
    ),
  ).toBe(true);
  await expect(page).toHaveURL(/sort=price-asc/);
  await expect(cards(page).first()).toContainText('0.99 ETH');
  await page.reload();
  await expect(
    page.getByRole('checkbox', { name: 'Música', exact: false }),
  ).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'Ethereum', exact: false }),
  ).toBeChecked();
  await expect(cards(page).first()).toContainText('0.99 ETH');
  await page.goBack();
  await expect(page).not.toHaveURL(/sort=price-asc/);
  await expect(cards(page)).toHaveCount(9);
});

test('mobile search can return empty results and reset filters', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(cards(page)).toHaveCount(9);
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' });
  await search.fill('obra inexistente');
  await search.press('Enter');
  await expect(catalog(page).getByText('Nenhum NFT encontrado')).toBeVisible();
  await expect(page).toHaveURL(/q=obra/);
  await page.getByRole('button', { name: 'Limpar busca e filtros' }).click();
  await expect(cards(page)).toHaveCount(9);
  await expect(search).toHaveValue('');
});

test('mobile drawer traps focus, applies a price range and restores focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(cards(page)).toHaveCount(9);
  const trigger = page.getByRole('button', { name: 'Abrir filtros' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Filtrar NFTs' });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 5; index++) {
    await page.keyboard.press('Tab');
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  const min = dialog.getByRole('slider', { name: 'Preço mínimo' });
  await min.focus();
  await min.press('ArrowRight');
  await expect(min).toHaveAttribute('aria-valuetext', '0.03 ETH');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('slider', { name: 'Preço mínimo' }).focus();
  await page.keyboard.press('ArrowRight');
  await dialog.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/min=3/);
});

test('a newer search cancels the stale Axios request and keeps the matching URL/results', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() =>
    localStorage.setItem('kurio:mock-scenario', 'race'),
  );
  await page.goto('/');
  await expect(cards(page)).toHaveCount(9);
  const search = page.getByRole('searchbox', { name: 'Buscar NFTs' });
  await search.fill('Emerald');
  const firstRequest = page.waitForRequest(
    (request) =>
      request.url().includes('/api/nfts?') &&
      new URL(request.url()).searchParams.get('q') === 'Emerald',
  );
  await search.press('Enter');
  await firstRequest;
  await expect(catalog(page).getByRole('status')).toContainText('Atualizando');
  const canceled = page.waitForEvent('requestfailed', {
    predicate: (request) =>
      request.url().includes('/api/nfts?') &&
      new URL(request.url()).searchParams.get('q') === 'Emerald',
  });
  await search.fill('Sage');
  await search.press('Enter');
  expect((await canceled).failure()?.errorText).toContain('ABORTED');
  await expect(page).toHaveURL(/q=Sage/);
  await expect(cards(page).first()).toContainText('Sage Nomad #009');
  expect(await cards(page).allTextContents()).toEqual(
    expect.arrayContaining([expect.stringContaining('Sage')]),
  );
  expect(
    (await cards(page).allTextContents()).every((text) =>
      text.includes('Sage'),
    ),
  ).toBe(true);
});

test('direct URL is normalized and desktop search restores after refresh', async ({
  page,
}) => {
  await page.goto('/?page=bad&sort=invalid&min=1230&max=2');
  await expect(cards(page)).toHaveCount(9);
  await expect(
    page.getByRole('button', { name: 'Página 1', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Abrir busca' }).click();
  const dialog = page.getByRole('dialog', { name: 'Buscar NFTs' });
  await dialog.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('Neon');
  await dialog.getByRole('searchbox', { name: 'Buscar NFTs' }).press('Enter');
  await expect(dialog).toBeHidden();
  await expect(cards(page).first()).toContainText('Neon Vessel #552');
  await page.reload();
  await expect(cards(page).first()).toContainText('Neon Vessel #552');
  await page.goBack();
  await expect(cards(page)).toHaveCount(9);
  await page.goForward();
  await expect(cards(page).first()).toContainText('Neon Vessel #552');
});

test('slow loading respects reduced motion and 503 can recover without a reload', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-23T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-23T12:00:01Z'));
  await page.addInitScript(() =>
    localStorage.setItem('kurio:mock-scenario', 'slow'),
  );
  await page.goto('/');
  const loading = catalog(page).getByRole('status');
  await expect(loading).toContainText('Carregando');
  expect(
    await page
      .locator('.skeleton-shimmer')
      .first()
      .evaluate((element) => getComputedStyle(element, '::after').display),
  ).toBe('none');
  await page.clock.resume();
  await expect(cards(page)).toHaveCount(9);
  await page.evaluate(() =>
    localStorage.setItem('kurio:mock-scenario', 'error'),
  );
  await page.getByRole('button', { name: 'Em alta', exact: true }).click();
  await expect(catalog(page).getByRole('alert')).toContainText(
    'Não foi possível carregar',
  );
  await page.evaluate(() => localStorage.removeItem('kurio:mock-scenario'));
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(cards(page)).toHaveCount(9);
});

test('visitor favorites preserve destination and open authentication', async ({ page }) => {
  await page.goto('/');
  await expect(cards(page)).toHaveCount(9);
  await cards(page).first().getByRole('button', { name: 'Favoritar Emerald Ape #042', exact: true }).click();
  await expect(page).toHaveURL(/\/login\?redirect=/);
  await expect(page.getByRole('dialog', { name: 'Entrar Criar conta' })).toBeVisible();
  expect(new URL(page.url()).searchParams.get('redirect')).toContain('/');
});
