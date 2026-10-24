import { expect, test, type Page } from '@playwright/test';
async function control(
  page: Page,
  method: string,
  url: string,
  data?: unknown,
) {
  return page.evaluate(
    async (input) => {
      const path = '/src/core/services/api/api.ts';
      const { api } = await import(path);
      const response = await api.request({
        ...input,
        validateStatus: () => true,
      });
      return { status: response.status, data: response.data };
    },
    { method, url, data },
  );
}
async function signIn(
  page: Page,
  redirect = '/account/profile',
  email = 'ana@kurio.test',
  password = 'Kurio123!',
) {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`);
  await page.getByLabel(/^E-mail/).fill(email);
  await page.getByLabel(/^Senha/).fill(password);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe(redirect);
}
async function addNft(page: Page) {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Ver Emerald Ape #042', exact: true })
    .click();
  await page.getByRole('radio', { name: '1/10', exact: true }).click();
  await page
    .getByRole('button', { name: /^(COMPRAR|Comprar NFT)$/ })
    .filter({ visible: true })
    .click();
  await expect(page).toHaveURL(/\/cart$/);
}
async function wallet(page: Page) {
  await page.goto('/account/wallets');
  await page.getByLabel(/^Apelido da carteira/).fill('Principal de teste');
  await page.getByLabel(/^Endereço da carteira/).fill(`0x${'c'.repeat(40)}`);
  await page
    .getByRole('button', { name: 'Salvar carteira', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Editar Principal de teste',
      exact: true,
    }),
  ).toBeVisible();
}
async function checkout(page: Page) {
  await page.goto('/checkout');
  await expect(
    page.getByRole('combobox', { name: 'Carteira salva', exact: true }),
  ).toBeVisible();
  if (
    await page
      .getByRole('button', { name: 'Conectar carteira', exact: true })
      .count()
  )
    await page
      .getByRole('button', { name: 'Conectar carteira', exact: true })
      .click();
  await expect(
    page.getByText('Carteira conectada na simulação.', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Revisar compra', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Confirmar compra', exact: true }),
  ).toBeEnabled();
}
async function seededCheckout(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('nft-card').first()).toBeVisible();
  await control(page, 'POST', '/mock/reset', { preset: 'populated' });
  await signIn(page, '/checkout');
  await checkout(page);
}
for (const width of [390, 1440]) {
  test(`catalog to confirmed receipt with persistent cart, coupon and wallet at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await addNft(page);
    const quantity = page.getByRole('group', {
      name: 'Quantidade de Emerald Ape #042',
    });
    await quantity.getByRole('button', { name: /Aumentar/ }).click();
    await expect(quantity.getByRole('status')).toHaveText('2');
    await page.getByLabel('Código promocional').fill('EXPIRED');
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Cupom expirado.' }),
    ).toBeVisible();
    await page.getByLabel('Código promocional').fill('KURIO10');
    await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
    await expect(
      page.getByText('Cupom KURIO10 aplicado.', { exact: false }),
    ).toBeVisible();
    await page.reload();
    await expect(quantity.getByRole('status')).toHaveText('2');
    await expect(
      page
        .getByText('2.152 ETH', { exact: true })
        .filter({ visible: true })
        .last(),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Conectar e finalizar', exact: true })
      .click();
    await expect(page).toHaveURL(/\/login\?redirect=/);
    await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
    await page.getByLabel(/^Senha/).fill('Kurio123!');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout$/);
    await page
      .getByRole('link', { name: 'Adicionar carteira', exact: true })
      .click();
    await page.getByLabel(/^Apelido da carteira/).fill('Principal de teste');
    await page.getByLabel(/^Endereço da carteira/).fill(`0x${'c'.repeat(40)}`);
    await page
      .getByRole('button', { name: 'Salvar carteira', exact: true })
      .click();
    await expect(
      page.getByRole('button', {
        name: 'Editar Principal de teste',
        exact: true,
      }),
    ).toBeVisible();
    await checkout(page);
    await page
      .getByRole('button', { name: 'Confirmar compra', exact: true })
      .dblclick();
    await expect(page).toHaveURL(/\/orders\/order-/);
    await expect(
      page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
    ).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: 'Ver recibo', exact: true }).click();
    await expect(
      page.getByRole('heading', {
        name: 'Seus NFTs agora estão na sua carteira',
      }),
    ).toBeVisible();
    await expect(
      page
        .getByText('2.152 ETH', { exact: true })
        .filter({ visible: true })
        .last(),
    ).toBeVisible();
    const receipt = await page.locator('.receipt-metadata').textContent();
    await page.reload();
    await expect(page.locator('.receipt-metadata')).toHaveText(receipt!);
    await page.screenshot({
      path: test.info().outputPath(`receipt-${width}.png`),
      fullPage: true,
    });
    await page.goto('/cart');
    await expect(
      page.getByText('Seu carrinho está vazio.', { exact: true }),
    ).toBeVisible();
    const inventory = await control(page, 'GET', '/mock/inventory');
    expect(
      inventory.data.items[0].editions.find(
        (item: { id: string }) => item.id === 'ten',
      ).available,
    ).toBe(8);
  });
}
test('registration associates validation errors, creates account, persists profile/avatar/password and edits two wallets', async ({
  page,
}) => {
  await page.goto('/register?redirect=%2Faccount%2Fprofile');
  await page.getByLabel(/^Nome de usuário/).fill('carol');
  await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
  await page.getByLabel(/^Senha/).fill('Newpass123!');
  await page.getByLabel(/^Confirmar senha/).fill('other');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByLabel(/^Confirmar senha/)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.getByLabel(/^Confirmar senha/).fill('Newpass123!');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(
    page.getByText('E-mail já cadastrado.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel(/^E-mail/).fill('carol@kurio.test');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page).toHaveURL(/\/account\/profile$/);
  await page.getByLabel(/^Nome de exibição/).fill('Carol Colecionadora');
  await page.getByLabel('Nome ENS', { exact: false }).fill('carol');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(
    page.getByText('Perfil atualizado.', { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Arquivo do avatar')
    .setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=',
        'base64',
      ),
    });
  await expect(page.getByAltText('Avatar do colecionador')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel(/^Nome de exibição/)).toHaveValue(
    'Carol Colecionadora',
  );
  await expect(page.getByAltText('Avatar do colecionador')).toBeVisible();
  await page.getByRole('button', { name: 'Remover', exact: true }).click();
  await expect(page.getByAltText('Avatar do colecionador')).toHaveCount(0);
  await page.getByLabel(/^Senha atual/).fill('wrong');
  await page.getByLabel(/^Nova senha/).fill('Changed123!');
  await page.getByLabel(/^Confirmar nova senha/).fill('Changed123!');
  await page
    .getByRole('button', { name: 'Alterar senha', exact: true })
    .click();
  await expect(page.getByLabel(/^Senha atual/)).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.getByLabel(/^Senha atual/).fill('Newpass123!');
  await page
    .getByRole('button', { name: 'Alterar senha', exact: true })
    .click();
  await expect(
    page.getByText('Senha alterada.', { exact: true }),
  ).toBeVisible();
  await wallet(page);
  await page.getByLabel(/^Apelido da carteira/).fill('Secundária');
  await page.getByLabel(/^Endereço da carteira/).fill('wrong');
  await page
    .getByRole('button', { name: 'Salvar carteira', exact: true })
    .click();
  await expect(
    page.getByText('Endereço incompatível com a rede.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel(/^Endereço da carteira/).fill(`0x${'d'.repeat(40)}`);
  await page
    .getByRole('button', { name: 'Salvar carteira', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Editar Secundária', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Editar Secundária', exact: true })
    .click();
  await page.getByLabel(/^Apelido da carteira/).fill('Secundária editada');
  await page
    .getByRole('button', { name: 'Salvar carteira', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Editar Secundária editada',
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('button', {
      name: 'Editar Secundária editada',
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await signIn(page, '/account/profile', 'carol@kurio.test', 'Changed123!');
  await expect(page.getByLabel(/^Nome de exibição/)).toHaveValue(
    'Carol Colecionadora',
  );
});
test('favorites persist, optimistically roll back a rejected mutation and stay private', async ({
  page,
}) => {
  await signIn(page, '/nfts/nft-1');
  const favorite = page.getByRole('button', {
    name: /^Favorit(ar|ado)$/,
    exact: true,
  });
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await expect(favorite).toBeEnabled();
  await page.reload();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Favoritos', exact: true }).click();
  await expect(
    page
      .getByRole('dialog', { name: 'Seus favoritos' })
      .getByRole('link', { name: 'Emerald Ape #042' }),
  ).toBeVisible();
  await page
    .getByRole('dialog', { name: 'Seus favoritos' })
    .getByRole('link', { name: 'Emerald Ape #042' })
    .click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(favorite).toBeEnabled();
  await control(page, 'PUT', '/mock/scenario', { scenario: 'conflict' });
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.getByText('Conflito simulado.', { exact: true }),
  ).toBeVisible();
  await expect(favorite).toHaveAttribute('aria-pressed', 'true');
  await control(page, 'PUT', '/mock/scenario', { scenario: 'default' });
  await favorite.click();
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
  await expect(favorite).toBeEnabled();
  await page.reload();
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/account/profile');
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await signIn(page, '/nfts/nft-1', 'bruno@kurio.test');
  await expect(favorite).toHaveAttribute('aria-pressed', 'false');
});
test('real-time price/stock changes require a new review and old or duplicate events do not regress UI', async ({
  page,
}) => {
  await seededCheckout(page);
  await control(page, 'PATCH', '/mock/nfts/nft-1', { price: '2.00' });
  await expect(
    page.getByText('Preço ou disponibilidade alterados.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirmar compra', exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Revisar compra', exact: true })
    .click();
  await expect(page.getByText('4.01 ETH', { exact: true })).toBeVisible();
  await control(page, 'POST', '/mock/events/replay', {
    name: 'nft.updated',
    resourceId: 'nft-1',
    mode: 'old',
  });
  await control(page, 'POST', '/mock/events/replay', {
    name: 'nft.updated',
    resourceId: 'nft-1',
    mode: 'duplicate',
  });
  await expect(page.getByText('4.01 ETH', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirmar compra', exact: true }),
  ).toBeEnabled();
  await control(page, 'PATCH', '/mock/nfts/nft-1', {
    editions: [{ id: 'ten', available: 0 }],
  });
  await expect(
    page.getByRole('button', { name: 'Revisar compra', exact: true }),
  ).toBeEnabled();
  await page
    .getByRole('button', { name: 'Revisar compra', exact: true })
    .click();
  await expect(
    page.getByText('Quantidade indisponível para esta edição.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.goto('/nfts/nft-1');
  await expect(
    page.getByRole('radio', { name: '1/10', exact: true }),
  ).toBeDisabled();
});
test('declined payment preserves cart and a new reviewed attempt can succeed', async ({
  page,
}) => {
  await seededCheckout(page);
  await control(page, 'PUT', '/mock/scenario', {
    scenario: 'payment-declined',
  });
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Pagamento recusado', exact: true }),
  ).toBeVisible({ timeout: 10000 });
  await page
    .getByRole('link', { name: 'Voltar ao carrinho', exact: true })
    .click();
  await expect(
    page
      .getByRole('group', { name: 'Quantidade de Emerald Ape #042' })
      .getByRole('status'),
  ).toHaveText('2');
  await control(page, 'PUT', '/mock/scenario', { scenario: 'default' });
  await checkout(page);
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
  ).toBeVisible({ timeout: 10000 });
});
test('timeout and refresh recover the same order; pending reconnect reconciles through REST', async ({
  page,
}) => {
  await seededCheckout(page);
  await control(page, 'PUT', '/mock/scenario', {
    scenario: 'timeout-after-create',
  });
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Recuperar pedido', exact: true }),
  ).toBeEnabled({ timeout: 10000 });
  const attempts = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('kurio:purchase:collector-1')!),
  );
  await page.reload();
  await page
    .getByRole('button', { name: 'Recuperar pedido', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
  ).toBeVisible({ timeout: 10000 });
  const id = new URL(page.url()).pathname.split('/').pop()!;
  expect((await control(page, 'GET', `/orders/${id}`)).data.status).toBe(
    'confirmed',
  );
  const persisted = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('kurio:mock-database:v1')!),
  );
  expect(
    Object.values(persisted.attempts).map(
      (item) => (item as { orderId: string }).orderId,
    ),
  ).toEqual([id]);
  expect(attempts.input.quoteId).toBeTruthy();
  // A separate purchase remains pending over disconnection and refresh.
  await control(page, 'PUT', '/mock/scenario', { scenario: 'order-pending' });
  await addNft(page);
  await checkout(page);
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Pedido pendente', exact: true }),
  ).toBeVisible();
  const pendingId = new URL(page.url()).pathname.split('/').pop()!;
  await control(page, 'POST', '/mock/connection/disconnect');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Pedido pendente', exact: true }),
  ).toBeVisible();
  await control(page, 'POST', `/mock/orders/${pendingId}/settle`, {
    status: 'confirmed',
  });
  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
  ).toBeVisible();
});
test('checkout rejects a server-expired quote, reconnect refusal and session expiration with context preserved', async ({
  page,
}) => {
  await seededCheckout(page);
  await page
    .getByRole('button', { name: 'Desconectar carteira', exact: true })
    .click();
  await control(page, 'PUT', '/mock/scenario', { scenario: 'wallet-rejected' });
  await page
    .getByRole('button', { name: 'Conectar carteira', exact: true })
    .click();
  await expect(
    page.getByText('Conexão recusada pelo usuário na simulação.', {
      exact: true,
    }),
  ).toBeVisible();
  await control(page, 'PUT', '/mock/scenario', { scenario: 'default' });
  await page
    .getByRole('button', { name: 'Conectar carteira', exact: true })
    .click();
  await expect(
    page.getByText('Carteira conectada na simulação.', { exact: true }),
  ).toBeVisible();
  await control(page, 'PATCH', '/mock/fees', { networkFee: '0.02' });
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByText('A cotação mudou ou expirou.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Revisar compra', exact: true }),
  ).toBeVisible();
  await control(page, 'PUT', '/mock/scenario', { scenario: 'session-expired' });
  await page
    .getByRole('button', { name: 'Revisar compra', exact: true })
    .click();
  await expect(page).toHaveURL(/\/login\?redirect=/);
  expect(new URL(page.url()).searchParams.get('redirect')).toBe('/checkout');
  await control(page, 'PUT', '/mock/scenario', { scenario: 'default' });
  await page.getByLabel(/^E-mail/).fill('ana@kurio.test');
  await page.getByLabel(/^Senha/).fill('Kurio123!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(
    page.getByRole('button', { name: 'Conectar carteira', exact: true }),
  ).toBeVisible();
});

test('mobile cart removes coupon and items with authoritative totals and persists the empty state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await addNft(page);
  await page.getByLabel('Código promocional').fill('KURIO10');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).click();
  await page
    .getByRole('button', { name: 'Remover cupom', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Remover cupom', exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Remover Emerald Ape #042', exact: true })
    .click();
  await expect(
    page.getByText('Seu carrinho está vazio.', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText('Seu carrinho está vazio.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Conectar e finalizar', exact: true }),
  ).toBeDisabled();
});
