import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createServer, loadEnv } from 'vite';
process.env.NODE_ENV ??= 'production';
let template = await readFile('dist/index.html', 'utf8');
const font = (await readdir('dist/assets')).find(
  (name) =>
    name.startsWith('roboto-mono-latin-wght-normal-') &&
    name.endsWith('.woff2'),
);
if (!font) throw new Error('Fonte Latin ausente no build.');
template = template.replace(
  /(<meta charset=[^>]+>)/i,
  `$1<link rel="preload" as="font" type="font/woff2" href="/assets/${font}" crossorigin="anonymous">`,
);
await writeFile('dist/spa.html', template);
const env = loadEnv('production', process.cwd(), 'VITE_');
if ((process.env.VITE_ENABLE_MOCKS ?? env.VITE_ENABLE_MOCKS) === 'false')
  process.exit(0);
const vite = await createServer({
  mode: 'production',
  cacheDir: 'node_modules/.vite-prerender',
  server: { middlewareMode: true },
  appType: 'custom',
});
let renderer;
try {
  renderer = await vite.ssrLoadModule('/src/core/prerender/render.tsx');
  renderer.start();
  const paths = process.env.PRERENDER_LIMIT
    ? renderer.paths.slice(0, Number(process.env.PRERENDER_LIMIT))
    : renderer.paths;
  for (const path of paths) {
    // Public content is already present. Give its font/images priority over
    // hydration downloads; the blank SPA fallback keeps normal script priority.
    const publicTemplate = template
      .replace(
        /rel="modulepreload"/g,
        'rel="modulepreload" fetchpriority="low"',
      )
      .replace(
        /<script type="module"/g,
        '<script fetchpriority="low" type="module"',
      );
    const html = await renderer.render(path, publicTemplate);
    const output = path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  console.log(
    `Pré-renderizadas ${paths.length} páginas públicas; fallback SPA preservado.`,
  );
} finally {
  renderer?.stop();
  await vite.close();
}
