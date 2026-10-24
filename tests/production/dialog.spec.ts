import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 1024, height: 650 }, { width: 1440, height: 720 }, { width: 1920, height: 1080 }]) {
  for (const mode of ['login', 'register']) {
    test(`${mode} dialog stays inside production viewport ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(`/${mode}`);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      // Wait for the actual CSS animation before measuring final geometry.
      await dialog.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
      });
      const geometry = await dialog.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const close = element.querySelector('[aria-label="Fechar formulário"]')!.getBoundingClientRect();
        return {
          top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom,
          center: rect.left + rect.width / 2,
          closeTop: close.top, closeBottom: close.bottom,
        };
      });
      expect(geometry.top).toBeGreaterThanOrEqual(24);
      expect(geometry.left).toBeGreaterThanOrEqual(24);
      expect(geometry.right).toBeLessThanOrEqual(viewport.width - 24);
      expect(geometry.bottom).toBeLessThanOrEqual(viewport.height - 24);
      expect(geometry.center).toBeCloseTo(viewport.width / 2, 0);
      expect(geometry.closeTop).toBeGreaterThanOrEqual(24);
      expect(geometry.closeBottom).toBeLessThanOrEqual(viewport.height - 24);
      await expect(page.getByLabel(/^E-mail/)).toBeVisible();
      await page.screenshot({ path: testInfo.outputPath(`${mode}.png`) });
      await page.getByRole('button', { name: 'Fechar formulário' }).click();
      await expect(dialog).toHaveCount(0);
      await expect(page.getByTestId('nft-card')).toHaveCount(9);
    });
  }
}

test('generic search dialog remains centered in production', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'Abrir busca' }).click();
  const dialog = page.getByRole('dialog', { name: 'Buscar NFTs' });
  await expect(dialog).toBeVisible();
  await dialog.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const centered = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < 1 &&
      Math.abs(rect.top + rect.height / 2 - innerHeight / 2) < 1;
  });
  expect(centered).toBe(true);
});
