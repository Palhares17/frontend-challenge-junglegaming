import { renderToString } from 'react-dom/server';
import { QueryClient } from '@tanstack/react-query';
import {
  createRequestHandler,
  renderSsrHtmlResponse,
} from '@tanstack/react-router/ssr/server';
import { setupServer } from 'msw/node';
import { App } from '@/core/app';
import { createAppRouter } from '@/core/router/router';
import { sessionOptions } from '@/core/session/session';
import { cartOptions } from '@/feature/cart/services/get-cart.service';
import { catalogOptions } from '@/feature/home/hooks/use-catalog';
import { defaultCatalogSearch } from '@/feature/home/schemas/catalog-search.schema';
import { handlers } from '@/core/mocks/handlers';
import { catalogFixtures } from '@/feature/home/mocks/catalog.fixtures';
const server = setupServer(...handlers);
export function start() {
  server.listen();
}
export function stop() {
  server.close();
}
export const paths = ['/', ...catalogFixtures.map((nft) => `/nfts/${nft.id}`)];
export async function render(path: string, template: string) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: false, gcTime: Infinity },
    },
  });
  await Promise.all([
    client.query(sessionOptions),
    client.query(cartOptions),
    ...(path === '/'
      ? [client.query(catalogOptions(defaultCatalogSearch))]
      : []),
  ]);
  let url = `http://localhost${path}`;
  let response: Response | undefined;
  for (let redirect = 0; redirect < 3; redirect++) {
    const handle = createRequestHandler({
      createRouter: () => createAppRouter(undefined, client),
      request: new Request(url),
    });
    response = await handle(({ router, responseHeaders }) =>
      renderSsrHtmlResponse({
        router,
        responseHeaders,
        render: () =>
          template
            .replace(/<!doctype html>/i, '')
            .replace(
              '<div id="root"></div>',
              `<div id="root" inert data-prerender-path="${path}" data-prerender-search="${new URL(url).search.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">${renderToString(<App appRouter={router} />)}</div>`,
            ),
      }),
    );
    const location = response.headers.get('location');
    if (!location) break;
    url = new URL(location, url).href;
  }
  const html = await response!.text();
  if (!response!.ok || !html.includes('<h1'))
    throw new Error(
      `Pré-renderização falhou: ${path}: ${response!.status}: ${html.slice(0, 200)}`,
    );
  client.clear();
  return html;
}
