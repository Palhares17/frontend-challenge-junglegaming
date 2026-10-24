import { expect, test, type Page } from '@playwright/test';

async function openLogin(page: Page) {
  await page.goto('/login?redirect=%2Faccount%2Fprofile');
  await expect(page.getByLabel(/^E-mail/)).toBeVisible();
}

async function submit(page: Page, password = 'invalid') {
  await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
  await page.getByLabel(/^Senha/).fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}

for (const width of [390, 768, 1440]) {
  test(`login error toast is accessible, stable and recovers by keyboard at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await openLogin(page);
    const email = page.getByLabel(/^E-mail/);
    const position = await email.boundingBox();
    await submit(page);
    const alert = page.getByRole('alert');
    await expect(alert).toHaveText('E-mail ou senha inválidos.');
    await expect(alert).toHaveCount(1);
    await expect(alert).toHaveAttribute('aria-live', 'assertive');
    await expect(email).toHaveValue('ana@kurio.test');
    await expect(page.getByLabel(/^Senha/)).toHaveValue('invalid');
    expect(await email.boundingBox()).toEqual(position);
    await expect(page.locator('.auth-form').getByRole('alert')).toHaveCount(0);
    await expect(page.locator('.auth-desktop-panel > [role="alert"]')).toHaveCount(0);
    expect(await alert.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const topmost = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return rect.x >= 0 && rect.right <= innerWidth && rect.y >= 0 && rect.bottom <= innerHeight &&
        !!topmost && element.contains(topmost);
    })).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('login-toast.png') });

    // A second failure replaces the previous notification instead of stacking.
    await submit(page);
    await expect(alert).toHaveCount(1);
    await expect(alert).toHaveText('E-mail ou senha inválidos.');
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeEnabled();
    await page.getByLabel(/^Senha/).fill('Kurio123!');
    await page.getByLabel(/^Senha/).focus();
    await page.keyboard.press('Enter');
    await expect(alert).toHaveCount(0);
    await expect(page).toHaveURL(/\/account\/profile$/);
    await expect(email).toHaveValue('ana@kurio.test');
  });
}

test('login service failure uses a toast and can be retried through MSW', async ({ page }) => {
  await openLogin(page);
  await page.evaluate(() => localStorage.setItem('kurio:navigation-scenario', 'error'));
  const response = page.waitForResponse((item) => item.url().endsWith('/api/session') && item.request().method() === 'POST');
  await submit(page, 'Kurio123!');
  expect((await response).status()).toBe(503);
  await expect(page.getByRole('alert')).toHaveText('Não foi possível entrar. Tente novamente.');
  await expect(page.getByLabel(/^Senha/)).toHaveValue('Kurio123!');
  await page.evaluate(() => localStorage.removeItem('kurio:navigation-scenario'));
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/account\/profile$/);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('login toast expires and is cleared when closing or switching authentication', async ({ page }) => {
  await openLogin(page);
  await submit(page);
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0, { timeout: 8000 });
  await submit(page);
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('link', { name: 'Criar conta', exact: true }).click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByRole('link', { name: 'Entrar', exact: true }).click();
  await submit(page);
  await expect(page.getByRole('alert')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$|\/\?/);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a login failure arriving after closing does not show a stale toast', async ({ page }) => {
  await openLogin(page);
  await page.evaluate(() => localStorage.setItem('kurio:navigation-scenario', 'slow'));
  const response = page.waitForResponse((item) => item.url().endsWith('/api/session') && item.request().method() === 'POST');
  await submit(page);
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$|\/\?/);
  expect((await response).status()).toBe(401);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'E-mail ou senha inválidos.' })).toHaveCount(0);
});
