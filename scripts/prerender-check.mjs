import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const origin = process.env.SMOKE_URL || 'http://127.0.0.1:4184';
const browser = await chromium.launch();
const results = [];
try {
  for (const path of ['/', '/nfts/nft-1']) {
    const html = await (await fetch(origin + path)).text();
    expect(html).toContain(`data-prerender-path="${path}"`);
    expect(html).toContain('<h1');
    for (const privateValue of [
      'ana@kurio.test',
      'passwordHash',
      'kurio:mock-session',
    ])
      expect(html).not.toContain(privateValue);
    const page = await browser.newPage({
      viewport: { width: 390, height: 1000 },
    });
    await page.addInitScript(() => {
      const now = Date.now.bind(Date);
      Date.now = () => now() + 3600000;
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const ready = page.waitForResponse((response) =>
      response.url().endsWith('/api/session'),
    );
    await page.goto(origin + path);
    await ready;
    await expect(page.locator('#root')).not.toHaveAttribute('inert', '');
    if (path === '/') await expect(page.getByTestId('nft-card')).toHaveCount(9);
    else
      await expect(
        page.getByRole('heading', { name: 'Emerald Ape #042', exact: true }),
      ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    results.push({
      path,
      publicHtml: true,
      olderCacheHydrates: true,
      pageErrors: errors,
    });
    await page.close();
  }
  const report = { url: origin, date: new Date().toISOString(), results };
  console.log(JSON.stringify(report, null, 2));
  await writeFile(
    process.env.SMOKE_REPORT || 'docs/prerender-check.json',
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}
