import { expect, test, type Page } from '@playwright/test';

const screens = [
  'nft',
  'cart',
  'checkout',
  'confirmation',
  'login',
  'register',
  'profile',
  'wallets',
] as const;
const preview = (screen: string) =>
  `/ui-preview.html?screen=${screen}&capture=1`;

async function ready(page: Page) {
  await expect(page.getByTestId('design-canvas')).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = 'eager';
        await image.decode();
      }),
    );
  });
}

for (const width of [390, 768, 1440]) {
  for (const screen of screens) {
    test(`${screen} renders local assets without overflow at ${width}px`, async ({
      page,
    }) => {
      const errors: string[] = [];
      const externalMedia: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (
          ['image', 'font'].includes(request.resourceType()) &&
          new URL(request.url()).origin !== 'http://127.0.0.1:4173'
        )
          externalMedia.push(request.url());
      });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(preview(screen));
      await ready(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() =>
          [...document.images].every(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        ),
      ).toBe(true);
      expect(externalMedia).toEqual([]);
      expect(errors).toEqual([]);
      await expect(page).toHaveScreenshot(`${screen}-${width}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}

test('NFT controls support keyboard, gallery focus return and honest purchase feedback', async ({
  page,
}) => {
  await page.goto(preview('nft'));
  await ready(page);
  const edition = page.getByRole('radiogroup', { name: 'Edição do NFT' });
  await edition.getByRole('radio', { name: '1/10', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(
    edition.getByRole('radio', { name: '1/10', exact: true }),
  ).toBeChecked();
  const quantity = page.getByRole('group', { name: 'Quantidade', exact: true });
  await quantity
    .getByRole('button', { name: 'Aumentar quantidade', exact: true })
    .click();
  await expect(quantity.getByRole('status')).toHaveText('2');
  await page
    .getByRole('button', {
      name: 'Ver imagem 3 de Emerald Ape #042',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Ver imagem 3 de Emerald Ape #042',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  const zoom = page.getByRole('button', {
    name: 'Ampliar imagem de Emerald Ape #042',
  });
  await zoom.click();
  const dialog = page.getByRole('dialog', {
    name: 'Imagem de Emerald Ape #042',
  });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab');
    await expect
      .poll(() =>
        dialog.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(zoom).toBeFocused();
  await page
    .getByRole('tab', { name: 'Avaliações de colecionadores (19)' })
    .click();
  await expect(
    page.getByRole('tabpanel', { name: /Avaliações de colecionadores/ }),
  ).toContainText('não estão disponíveis');
  await page.getByRole('button', { name: 'COMPRAR', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(
    'Este recurso ainda não está disponível nesta versão.',
  );
  await expect(page).toHaveURL(preview('nft'));
});

test('checkout wallet choices respond to keyboard and purchase does not simulate success', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(preview('checkout'));
  const saved = page.getByRole('radiogroup', { name: 'Carteiras salvas' });
  await saved.getByRole('radio', { name: 'Principal', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(
    saved.getByRole('radio', { name: 'Principal', exact: true }),
  ).toBeChecked();
  const providers = page.getByRole('radiogroup', {
    name: 'Provedor de carteira',
  });
  await providers.getByRole('radio', { name: 'MetaMask', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(
    providers.getByRole('radio', { name: 'MetaMask', exact: true }),
  ).toBeChecked();
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(
    'Este recurso ainda não está disponível nesta versão.',
  );
  await expect(page).toHaveURL(preview('checkout'));
});

test('auth dialog traps focus, toggles password and switches presentation without adding a route', async ({
  page,
}) => {
  await page.goto(preview('login'));
  const login = page.getByRole('dialog');
  await login
    .getByRole('textbox', { name: 'E-mail', exact: true })
    .fill('colecionador@example.com');
  await login.getByLabel(/^Senha/).fill('senha-ficticia');
  await login
    .getByRole('button', { name: 'Mostrar senha', exact: true })
    .click();
  await expect(login.getByLabel(/^Senha/)).toHaveAttribute('type', 'text');
  await login
    .getByRole('button', { name: 'Ocultar senha', exact: true })
    .click();
  await expect(login.getByLabel(/^Senha/)).toHaveAttribute('type', 'password');
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab');
    await expect
      .poll(() =>
        login.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true);
  }
  await login.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByLabel(/^Confirmar senha/),
  ).toBeVisible();
  await expect(page).toHaveURL(preview('login'));
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
  ).toBeVisible();
});

test('account labels focus inputs, native required validation prevents an empty save', async ({
  page,
}) => {
  await page.goto(preview('profile'));
  const name = page.getByRole('textbox', {
    name: 'Nome de exibição',
    exact: false,
  });
  await page.locator('label').filter({ hasText: 'Nome de exibição' }).click();
  await expect(name).toBeFocused();
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(name).toBeFocused();
  await expect(page.getByRole('dialog')).toBeHidden();
  expect(
    await name.evaluate(
      (element: HTMLInputElement) => element.validity.valueMissing,
    ),
  ).toBe(true);
});
