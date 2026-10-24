import { test, expect } from '@playwright/test';
for (const width of [390, 768, 1440]) {
  test(`functional account and checkout layouts at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByTestId('nft-card').first()).toBeVisible();
    await page.evaluate(async () => {
      const path = '/src/core/services/api/api.ts';
      const { api } = await import(path);
      await api.post('/mock/reset', { preset: 'populated' });
    });
    await page.goto('/login?redirect=%2Fcheckout');
    await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
    await page.getByLabel(/^Senha/).fill('Kurio123!');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    for (const [screen, url, locator] of [
      [
        'cart',
        '/cart',
        page.getByRole('group', { name: 'Quantidade de Emerald Ape #042' }),
      ],
      [
        'checkout',
        '/checkout',
        page.getByRole('combobox', { name: 'Carteira salva' }),
      ],
      ['profile', '/account/profile', page.getByLabel(/^Nome de exibição/)],
      [
        'wallets',
        '/account/wallets',
        page.getByRole('button', { name: 'Editar Principal Ana', exact: true }),
      ],
    ] as const) {
      await page.goto(url);
      await expect(locator).toBeVisible();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((img) => {
            img.loading = 'eager';
            return img.decode();
          }),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page).toHaveScreenshot(`${screen}-${width}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
}
