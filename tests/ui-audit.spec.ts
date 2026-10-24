import { expect, test, type Page } from '@playwright/test';

async function login(page: Page, redirect = '/account/profile') {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`);
  await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
  await page.getByLabel(/^Senha/).fill('Kurio123!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe(redirect);
}

async function capture(page: Page, name: string) {
  await page.screenshot({ path: test.info().outputPath(name), animations: 'disabled' });
}

function contrast(first: number[], second: number[]) {
  const luminance = (rgb: number[]) => rgb
    .map((value) => value / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}

for (const width of [1024, 1440]) {
  test(`auth actions remain reachable with a persistent close button at ${width}x600`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.goto('/register');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    for (const provider of ['Google', 'Facebook']) {
      const button = dialog.getByRole('button', { name: `Continuar com ${provider}` });
      await button.scrollIntoViewIfNeeded();
      const bounds = (await button.boundingBox())!;
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(600);
      const close = (await dialog.getByRole('button', { name: 'Fechar formulário' }).boundingBox())!;
      expect(close.y).toBeGreaterThanOrEqual(0);
      expect(close.y + close.height).toBeLessThanOrEqual(600);
      expect(await page.evaluate(() => scrollY)).toBe(0);
    }
    if (width === 1440) await capture(page, 'auth-low-window.png');
    await dialog.getByRole('button', { name: 'Fechar formulário' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toBeFocused();
  });
}

test('auth keeps the filtered catalog, geometry, scroll and return focus', async ({ page }) => {
  await page.goto('/?q=Golden&sort=price-asc');
  const cards = page.getByTestId('nft-card');
  await expect(cards.first()).toContainText('Golden');
  const sourceSearch = Object.fromEntries(new URL(page.url()).searchParams);
  const enter = page.getByRole('link', { name: 'Entrar', exact: true });
  await enter.focus();
  // Scrolling with the wheel keeps the link focused, allowing an actual Enter key activation.
  await page.mouse.move(800, 300);
  await page.mouse.wheel(0, 180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  const before = await page.evaluate(() => ({
    scroll: scrollY,
    title: document.querySelector('h1')!.getBoundingClientRect().toJSON(),
    cards: [...document.querySelectorAll('[data-testid="nft-card"]')].map((card) => card.textContent),
  }));
  await capture(page, 'catalog-before-auth.png');
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const background = page.locator('.home-shell');
  await expect(background.locator('h1')).toHaveText('SEJA DONO DO FUTURO DA ARTE DIGITAL', { useInnerText: true });
  const during = await background.evaluate((element) => ({
    scroll: scrollY,
    title: element.querySelector('h1')!.getBoundingClientRect().toJSON(),
    cards: [...element.querySelectorAll('[data-testid="nft-card"]')].map((card) => card.textContent),
  }));
  expect(during).toEqual(before);
  await capture(page, 'catalog-during-auth.png');
  await dialog.getByRole('link', { name: 'Criar conta', exact: true }).click();
  await expect(dialog.getByLabel(/^Confirmar senha/)).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(before.scroll);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect.poll(() => Object.fromEntries(new URL(page.url()).searchParams)).toEqual(sourceSearch);
  await expect(enter).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(before.scroll);
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Fechar formulário' }).click();
  await expect(enter).toBeFocused();
});

test('long dialog title text does not intersect the close target', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ler mais', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Como funciona a propriedade de NFTs' });
  await expect(dialog).toBeVisible();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const intersects = await dialog.evaluate((element) => {
      const close = element.querySelector('[data-slot="dialog-close"]')!.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element.querySelector('[data-slot="dialog-title"]')!);
      return [...range.getClientRects()].some((text) =>
        text.left < close.right && text.right > close.left && text.top < close.bottom && text.bottom > close.top,
      );
    });
    expect(intersects).toBe(false);
  }
  await dialog.getByRole('button', { name: 'Entendi', exact: true }).press('Shift+Tab');
  await capture(page, 'long-dialog-title.png');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ler mais', exact: true }).first()).toBeFocused();
});

for (const width of [390, 768, 1440]) {
  test(`editions and coupon remain identifiable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/nfts/nft-1');
    const editions = page.getByRole('radiogroup', { name: 'Edição do NFT' });
    for (const label of ['1/1', '1/10', '1/50', 'ABERTA']) {
      await expect(editions.getByRole('radio', { name: label, exact: true })).toHaveCount(1);
    }
    await editions.getByRole('radio', { name: '1/1', exact: true }).focus();
    await page.keyboard.press('Space');
    await expect(editions.getByRole('radio', { name: '1/1', exact: true })).toBeChecked();
    await page.goto('/cart');
    const apply = page.getByRole('button', { name: 'Aplicar', exact: true });
    await expect(apply).toBeVisible();
    const colors = await apply.evaluate((element) => {
      const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const styles = getComputedStyle(element);
      return { text: rgb(styles.color), background: rgb(styles.backgroundColor), gradient: styles.backgroundImage };
    });
    if (width === 390) await capture(page, 'coupon-390.png');
    if (width < 1024) {
      // Check the lightest and darkest gradient stops over the actual card background.
      const copper = [210, 138, 76];
      const alpha = Number(colors.gradient.match(/rgba\(210, 138, 76, ([\d.]+)\)/)![1]);
      const blended = copper.map((value, index) => value * alpha + colors.background[index] * (1 - alpha));
      expect(contrast(colors.text, blended)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.text, copper)).toBeGreaterThanOrEqual(4.5);
    } else {
      expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  test(`account controls and empty wallet state are clear at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await login(page);
    const inputs = page.locator('.visual-form input[data-slot="input"]');
    await expect(inputs.first()).toBeVisible();
    const edges = await inputs.evaluateAll((elements) => elements.map((element) => {
      const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      return { edge: rgb(getComputedStyle(element).borderColor), background: rgb(getComputedStyle(document.body).backgroundColor) };
    }));
    for (const colors of edges) expect(contrast(colors.edge, colors.background)).toBeGreaterThanOrEqual(3);
    if (width === 1440) await capture(page, 'profile-1440.png');
    if (width >= 1024) {
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: 'Início', exact: true })).not.toHaveAttribute('aria-current', 'page');
    }
    await page.goto('/account/wallets');
    const save = page.getByRole('button', { name: 'Salvar carteira', exact: true });
    await expect(save).toBeVisible();
    const padding = await save.evaluate((element) => ({
      start: parseFloat(getComputedStyle(element).paddingInlineStart),
      end: parseFloat(getComputedStyle(element).paddingInlineEnd),
    }));
    expect(padding.start).toBeGreaterThanOrEqual(20);
    expect(padding.end).toBeGreaterThanOrEqual(20);
    if (width === 390) await capture(page, 'wallets-390.png');
    if (width >= 1024) {
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: 'Início', exact: true })).not.toHaveAttribute('aria-current', 'page');
    }
    await page.goto('/checkout');
    await expect(page.getByText('Seu carrinho está vazio.', { exact: false })).toBeVisible();
    if (width < 1024) {
      await expect(page.getByText('Você ainda não adicionou uma carteira.', { exact: false })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Carteira conectada', exact: true })).toHaveCount(0);
      await expect(page.getByRole('radiogroup', { name: 'Carteiras salvas', exact: true })).toHaveCount(0);
      if (width === 390) await capture(page, 'checkout-empty-390.png');
      await page.getByRole('link', { name: 'Adicionar carteira', exact: true }).click();
      await expect(page).toHaveURL(/\/account\/wallets$/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [390, 639, 640, 768, 1440]) {
  test(`receipt wallet description fits without arbitrary word breaks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await login(page, '/orders/demo-confirmed/confirmation');
    const wallet = page.locator('.receipt-metadata > div').filter({ has: page.locator('dt', { hasText: /^Carteira$/ }) });
    await expect(wallet).toContainText('Carteira de demonstração');
    const widths = await wallet.locator('dd').evaluate((element) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      context.font = getComputedStyle(element).font;
      return { word: context.measureText('demonstração').width, column: element.clientWidth };
    });
    expect(widths.column).toBeGreaterThanOrEqual(widths.word);
    if (width === 640) await capture(page, 'receipt-640.png');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
