import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const origin = process.env.SMOKE_URL;
if (!origin) throw new Error('Defina SMOKE_URL com a URL do deploy/build.');
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 1000 },
    reducedMotion: 'reduce',
  });
  const open = async (url) => {
    const initialized = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/session') &&
        response.request().method() === 'GET',
    );
    await page.goto(url);
    return await initialized;
  };
  const reload = async () => {
    const initialized = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/session') &&
        response.request().method() === 'GET',
    );
    await page.reload();
    await initialized;
  };
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const control = (method, path, body) =>
    page.evaluate(
      async ({ method, path, body }) => {
        const response = await fetch('/api' + path, {
          method,
          headers: { 'Content-Type': 'application/json' },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
        if (!response.ok)
          throw new Error('API ' + response.status + ' ' + path);
        return response.status === 204 ? null : response.json();
      },
      { method, path, body },
    );
  await open(origin);
  await expect(page.getByTestId('nft-card').first()).toBeVisible();
  await control('POST', '/mock/reset', { preset: 'default' });
  await open(origin + '/nfts/nft-1');
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
  ).toBeVisible();
  await reload();
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
  ).toBeVisible();
  results.push('Acesso direto/refresh do detalhe, assets e MSW');
  await control('PATCH', '/mock/nfts/nft-1', { price: '2.00' });
  await expect(
    page
      .getByText('2.00 ETH', { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  results.push('Socket.IO atualiza o preço no detalhe pela interface');
  await page.getByRole('radio', { name: '1/10', exact: true }).click();
  await page.getByRole('button', { name: 'Comprar NFT', exact: true }).click();
  await expect(page).toHaveURL(/\/cart$/);
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
  await page.getByLabel(/^Apelido da carteira/).fill('Carteira de avaliação');
  await page.getByLabel(/^Endereço da carteira/).fill(`0x${'e'.repeat(40)}`);
  await page
    .getByRole('button', { name: 'Salvar carteira', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Editar Carteira de avaliação',
      exact: true,
    }),
  ).toBeVisible();
  await open(origin + '/checkout');
  await page
    .getByRole('button', { name: 'Conectar carteira', exact: true })
    .click();
  await expect(
    page.getByText('Carteira conectada na simulação.', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Revisar compra', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Confirmar compra', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Pedido confirmado', exact: true }),
  ).toBeVisible({ timeout: 15000 });
  await page.getByRole('link', { name: 'Ver recibo', exact: true }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Seus NFTs agora estão na sua carteira',
    }),
  ).toBeVisible();
  const receipt = await page.locator('.receipt-metadata').textContent();
  await reload();
  await expect(page.locator('.receipt-metadata')).toHaveText(receipt);
  results.push(
    'Compra pela UI, merge de visitante, carteira, cotação, pedido/recibo e refresh privado',
  );
  await open(origin + '/cart');
  await expect(
    page.getByText('Seu carrinho está vazio.', { exact: true }),
  ).toBeVisible();
  const restored = await open(origin + '/');
  expect((await restored.json()).user.email).toBe('ana@kurio.test');
  await open(origin + '/?q=Golden&sort=price-asc');
  await expect(page.getByTestId('nft-card').first()).toContainText('Golden');
  expect(new URL(page.url()).searchParams.get('q')).toBe('Golden');
  await open(origin + '/nfts/missing');
  await expect(
    page.getByRole('heading', { name: 'Recurso não encontrado', exact: true }),
  ).toBeVisible();
  results.push(
    'Sessão recuperada após HTML público, busca na URL e fallback para NFT inexistente',
  );
  await page.goto(origin + '/ui-preview.html?screen=nft');
  await expect(page.getByTestId('design-canvas')).toBeVisible();
  results.push('Baixa do carrinho e entrada separada de prévia');
  if (errors.length) throw new Error(JSON.stringify(errors));
  const evidence = {
    url: origin,
    date: new Date().toISOString(),
    browser: browser.version(),
    results,
    pageErrors: errors,
  };
  console.log(JSON.stringify(evidence, null, 2));
  await writeFile(
    process.env.SMOKE_REPORT || 'docs/deployment-smoke.json',
    JSON.stringify(evidence, null, 2) + '\n',
  );
} finally {
  await browser.close();
}
