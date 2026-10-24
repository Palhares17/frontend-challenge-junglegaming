import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import lighthouse from 'lighthouse';
const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');
const output = new URL('../docs/lighthouse/', import.meta.url);
await mkdir(output, { recursive: true });
const origin = process.env.LIGHTHOUSE_URL || 'http://127.0.0.1:4184';
const results = [];
let browserVersion;
for (const device of ['mobile', 'desktop']) {
  for (const [page, path] of [
    ['home', '/'],
    ['nft', '/nfts/nft-1'],
  ]) {
    for (let run = 1; run <= 3; run++) {
      const browser = await chromium.launch({
        headless: true,
        args: ['--remote-debugging-port=9223'],
      });
      try {
        browserVersion = browser.version();
        const flags = {
          port: 9223,
          output: ['html', 'json'],
          logLevel: 'error',
          onlyCategories: [
            'performance',
            'accessibility',
            'best-practices',
            'seo',
          ],
        };
        if (device === 'desktop')
          Object.assign(flags, {
            formFactor: 'desktop',
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
            },
          });
        const result = await lighthouse(
          origin + path,
          flags,
          undefined,
          undefined,
        );
        if (!result || result.lhr.runtimeError)
          throw new Error(JSON.stringify(result?.lhr.runtimeError));
        const name = `${page}-${device}-${run}`;
        await writeFile(new URL(`${name}.html`, output), result.report[0]);
        await writeFile(new URL(`${name}.json`, output), result.report[1]);
        const row = {
          page,
          device,
          run,
          scores: Object.fromEntries(
            Object.entries(result.lhr.categories).map(([id, value]) => [
              id,
              Math.round(value.score * 100),
            ]),
          ),
          lcp: result.lhr.audits['largest-contentful-paint'].numericValue,
          cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
          tbt: result.lhr.audits['total-blocking-time'].numericValue,
        };
        results.push(row);
        console.log(JSON.stringify(row));
        await writeFile(
          new URL('results.json', output),
          JSON.stringify(
            {
              environment: {
                node: process.version,
                os: `${os.type()} ${os.release()} ${os.arch()}`,
                chromium: browserVersion,
                lighthouse: result.lhr.lighthouseVersion,
                origin,
                note: 'Build otimizado; mocks padrão completos; navegação completa com bootstrap do Service Worker; sem desativar assets, fontes ou funcionalidades.',
              },
              runs: results,
            },
            null,
            2,
          ),
        );
      } finally {
        await browser.close();
      }
    }
  }
}
const median = (values) => [...values].sort((a, b) => a - b)[1];
const summary = [];
for (const page of ['home', 'nft'])
  for (const device of ['mobile', 'desktop']) {
    const runs = results.filter(
      (row) => row.page === page && row.device === device,
    );
    summary.push({
      page,
      device,
      ...Object.fromEntries(
        Object.keys(runs[0].scores).map((id) => [
          id,
          median(runs.map((row) => row.scores[id])),
        ]),
      ),
      lcp: median(runs.map((row) => row.lcp)),
      cls: median(runs.map((row) => row.cls)),
      tbt: median(runs.map((row) => row.tbt)),
    });
  }
await writeFile(
  new URL('medians.json', output),
  JSON.stringify(summary, null, 2),
);
console.log('Medianas:', JSON.stringify(summary));
