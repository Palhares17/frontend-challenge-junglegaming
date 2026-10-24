import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const metadata = await stat(file).catch(() => null);
    if (metadata?.isDirectory()) file = resolve(file, 'index.html');
    else if (!metadata?.isFile()) file = resolve(root, 'spa.html');
    const bytes = await readFile(file);
    const compress =
      /gzip/.test(request.headers['accept-encoding'] || '') &&
      /\.(html|js|css|svg|json|txt)$/.test(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      Vary: 'Accept-Encoding',
      ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
    });
    response.end(compress ? gzipSync(bytes) : bytes);
  } catch {
    response.writeHead(500).end();
  }
}).listen(Number(process.env.PORT || 4184), '127.0.0.1', () =>
  console.log(
    'Build disponível em http://127.0.0.1:' + (process.env.PORT || 4184),
  ),
);
