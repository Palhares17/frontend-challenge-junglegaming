import { expect, test, type Page } from '@playwright/test';

async function login(
  page: Page,
  email = 'ana@kurio.test',
  password = 'Kurio123!',
) {
  await page.getByLabel(/^E-mail/).fill(email);
  await page.getByLabel(/^Senha/).fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}
async function openLogin(page: Page, redirect = '/account/profile') {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`);
  await expect(page.getByLabel(/^E-mail/)).toBeVisible();
}

for (const width of [390, 768, 1440]) {
  test(`catalog links, return, refresh and history preserve URL state at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/?q=Emerald&sort=price-asc&tab=new');
    const card = page.getByTestId('nft-card').first();
    await expect(card).toBeVisible();
    const source = new URL(page.url()).search;
    const detailResponse = page.waitForResponse((response) =>
      response.url().includes('/api/nfts/nft-1'),
    );
    await card
      .getByRole('link', { name: 'Ver Emerald Ape #042', exact: true })
      .click();
    expect((await detailResponse).status()).toBe(200);
    await expect(page).toHaveURL(/\/nfts\/nft-1$/);
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
    ).toBeVisible();
    if (width >= 1024)
      await page
        .getByRole('navigation', { name: 'Caminho da página' })
        .getByRole('link', { name: 'Início' })
        .click();
    else
      await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    await expect
      .poll(() => Object.fromEntries(new URL(page.url()).searchParams))
      .toEqual(Object.fromEntries(new URLSearchParams(source)));
    await expect(page.getByTestId('nft-card').first()).toContainText('Emerald');
    await page.goBack();
    await expect(page).toHaveURL(/\/nfts\/nft-1$/);
    await page.goForward();
    await expect(page).toHaveURL(/q=Emerald/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test(`direct routes, private navigation and empty checkout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByTestId('nft-card')).toHaveCount(9);
    if (width >= 1024)
      await page
        .getByRole('link', { name: 'Abrir carrinho', exact: true })
        .click();
    else
      await page
        .getByRole('navigation', { name: 'Navegação mobile' })
        .getByRole('link', { name: 'Carrinho', exact: true })
        .click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(
      page.getByText('Seu carrinho está vazio.', { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByText('Seu carrinho está vazio.', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Conectar e finalizar' })).toBeDisabled();
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login\?redirect=/);
    await login(page);
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByText('Seu carrinho está vazio.', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Revisar compra' })).toBeDisabled();
    await page.goto('/account/profile');
    await expect(page.getByLabel(/^E-mail/)).toHaveValue('ana@kurio.test');
    const nav = page.getByRole('navigation', {
      name: width >= 1024 ? 'Minha conta' : 'Minha conta mobile',
      exact: true,
    });
    await nav.getByRole('link', { name: 'Carteiras', exact: true }).click();
    await expect(page).toHaveURL(/\/account\/wallets$/);
    await page.reload();
    await expect(
      page.getByRole('heading', { name: 'Carteira principal', exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await nav.getByRole('button', { name: 'Sair', exact: true }).click();
    await expect(page).toHaveURL(/\/$|\/\?/);
    if (width >= 1024)
      await page
        .getByRole('contentinfo')
        .getByRole('link', { name: 'Meu perfil', exact: true })
        .click();
    else
      await page
        .getByRole('navigation', { name: 'Navegação mobile' })
        .getByRole('link', { name: 'Meu perfil', exact: true })
        .click();
    await expect(page).toHaveURL(/\/login\?redirect=/);
  });
}

test('login validates credentials, retains internal query/hash and session survives refresh', async ({
  page,
}) => {
  const target = '/checkout?network=ethereum#review';
  await page.goto(target);
  await expect(page).toHaveURL(/\/login\?redirect=/);
  expect(new URL(page.url()).searchParams.get('redirect')).toBe(target);
  await login(page, 'ana@kurio.test', 'invalid');
  await expect(page.getByRole('alert')).toHaveText(
    'E-mail ou senha inválidos.',
  );
  await expect(page).toHaveURL(/\/login/);
  await login(page);
  await expect(page).toHaveURL(
    new RegExp('/checkout\\?network=ethereum#review$'),
  );
  await page.reload();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(
    page.getByRole('button', { name: 'Revisar compra' }),
  ).toBeVisible();
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  expect(storage).not.toContain('Kurio123!');
  expect(storage).not.toContain('invalid');
});

test('expired session redirects on navigation and supports resuming the same destination', async ({
  page,
}) => {
  await openLogin(page);
  const recoveredSession = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/session') &&
      response.request().method() === 'GET',
  );
  await login(page);
  expect((await (await recoveredSession).json()).user.email).toBe(
    'ana@kurio.test',
  );
  await expect(page).toHaveURL(/\/account\/profile$/);
  await expect(page.getByLabel(/^E-mail/)).toHaveValue('ana@kurio.test');
  await page.evaluate(() => {
    const session = JSON.parse(localStorage.getItem('kurio:mock-session')!);
    localStorage.setItem(
      'kurio:mock-session',
      JSON.stringify({ ...session, expiresAt: 0 }),
    );
  });
  // Socket.IO now revokes the expired session without waiting for a click.
  await expect(page).toHaveURL(/\/login\?redirect=/);
  expect(new URL(page.url()).searchParams.get('redirect')).toBe('/account/profile');
  await login(page);
  await expect(page).toHaveURL(/\/account\/profile$/);
});

test('login and register are routes, Escape closes predictably and return URLs are sanitized', async ({
  page,
}) => {
  await openLogin(page, '/checkout');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Criar conta', exact: true })
    .click();
  await expect(page).toHaveURL(/\/register\?redirect=/);
  await page.reload();
  await expect(page.getByLabel(/^Confirmar senha/)).toBeVisible();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Entrar', exact: true })
    .click();
  await expect(page).toHaveURL(/\/login\?redirect=/);
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$|\/\?/);
  await openLogin(page, '//evil.test/account/profile');
  await login(page);
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/$|127\.0\.0\.1:4173\/\?/);
});

test('confirmed historical orders use the API snapshot and other states never display a receipt', async ({
  page,
}) => {
  await openLogin(page, '/orders/demo-confirmed');
  await login(page);
  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
  ).toBeVisible();
  const response = page.waitForResponse((response) =>
    response.url().includes('/api/orders/demo-confirmed'),
  );
  await page.reload();
  const snapshot = (await (await response).json()).receipt;
  expect(snapshot.status).toBe('confirmed');
  await page.getByRole('link', { name: 'Ver recibo' }).click();
  await expect(page).toHaveURL(/\/orders\/demo-confirmed\/confirmation$/);
  await expect(
    page.getByRole('heading', {
      name: 'Seus NFTs agora estão na sua carteira',
    }),
  ).toBeVisible();
  await expect(
    page.getByText(snapshot.transactionId, { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', {
      name: 'Seus NFTs agora estão na sua carteira',
    }),
  ).toBeVisible();
  for (const [id, heading] of [
    ['demo-pending', 'Pedido pendente'],
    ['demo-declined', 'Pagamento recusado'],
    ['missing', 'Recurso não encontrado'],
  ]) {
    await page.goto(`/orders/${id}/confirmation`);
    await expect(
      page.getByRole('heading', { name: heading, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Seus NFTs agora estão na sua carteira'),
    ).toHaveCount(0);
  }
  await page.goto('/account/profile');
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(page).toHaveURL(/\/$|\/\?/);
  await openLogin(page, '/orders/demo-confirmed/confirmation');
  await login(page, 'bruno@kurio.test');
  await expect(
    page.getByRole('heading', { name: 'Recurso não encontrado' }),
  ).toBeVisible();
  await expect(
    page.getByText(snapshot.transactionId, { exact: true }),
  ).toHaveCount(0);
  await page.goto('/orders/demo-bruno/confirmation');
  await expect(
    page.getByRole('heading', {
      name: 'Seus NFTs agora estão na sua carteira',
    }),
  ).toBeVisible();
});

test('route loading, network failure, retry and missing resources use MSW', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('kurio:navigation-scenario', 'slow'),
  );
  await page.goto('/nfts/nft-1');
  await expect(
    page.getByRole('status', { name: 'Carregando página' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem('kurio:navigation-scenario', 'error'),
  );
  await page
    .getByRole('link', { name: 'Ver Sage Nomad #009', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('Verifique sua conexão');
  await page.evaluate(() =>
    localStorage.removeItem('kurio:navigation-scenario'),
  );
  await page
    .getByRole('button', { name: 'Tentar novamente', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Sage Nomad #009', exact: true }),
  ).toBeVisible();
  await page.goto('/nfts/missing');
  await expect(
    page.getByRole('heading', { name: 'Recurso não encontrado' }),
  ).toBeVisible();
  await page.goto('/does-not-exist');
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
});

test('links work by keyboard and auth dialog retains focus', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.getByRole('link', {
    name: 'Ver Emerald Ape #042',
    exact: true,
  });
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/nfts\/nft-1$/);
  const signIn = page.getByRole('link', { name: 'Entrar', exact: true });
  await signIn.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Tab');
    await expect
      .poll(() =>
        dialog.evaluate((element) => element.contains(document.activeElement)),
      )
      .toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
});

test('preview keeps all nine presentations including a memory-router home', async ({
  page,
}) => {
  await page.goto('/ui-preview.html?screen=home');
  await expect(page.getByTestId('nft-card')).toHaveCount(9);
  await expect(page).toHaveURL(/ui-preview\.html\?screen=home$/);
  for (const screen of [
    'nft',
    'cart',
    'checkout',
    'confirmation',
    'login',
    'register',
    'profile',
    'wallets',
  ]) {
    await page.goto(`/ui-preview.html?screen=${screen}`);
    await expect(page.getByTestId('design-canvas')).not.toBeEmpty();
    await expect(page).toHaveURL(`/ui-preview.html?screen=${screen}`);
  }
});

test('session API outage blocks private content and retry recovers without a new login', async ({
  page,
}) => {
  await openLogin(page, '/account/profile');
  await login(page);
  await expect(page).toHaveURL(/\/account\/profile$/);
  await expect(page.getByLabel(/^E-mail/)).toHaveValue('ana@kurio.test');
  await page.evaluate(() =>
    localStorage.setItem('kurio:navigation-scenario', 'error'),
  );
  await page.goto('/account/profile');
  await expect(
    page.getByRole('heading', {
      name: 'Não foi possível carregar a página',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByLabel(/^E-mail/)).toHaveCount(0);
  await page.evaluate(() =>
    localStorage.removeItem('kurio:navigation-scenario'),
  );
  await page
    .getByRole('button', { name: 'Tentar novamente', exact: true })
    .click();
  await expect(page.getByLabel(/^E-mail/)).toHaveValue('ana@kurio.test');
});
