import { createRouter, type RouterHistory } from '@tanstack/react-router';
import {
  QueryClient,
  dehydrate,
  hydrate,
  type DehydratedState,
} from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { RouteError, RouteNotFound, RoutePending } from './route-feedback';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: false } },
});
export function createAppRouter(
  history?: RouterHistory,
  client: QueryClient = queryClient,
) {
  return createRouter({
    history,
    routeTree,
    context: { queryClient: client },
    dehydrate: () => ({ queryClientState: JSON.stringify(dehydrate(client)) }),
    hydrate: (state) => {
      const cached = JSON.parse(state.queryClientState) as DehydratedState;
      // Static HTML can be older than staleTime. Reconcile after hydration via
      // the socket's initial connect, without adding fetching UI mid-hydration.
      for (const query of cached.queries)
        query.state.dataUpdatedAt = Date.now();
      hydrate(client, cached);
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 150,
    defaultPendingMinMs: 200,
    defaultPendingComponent: RoutePending,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: RouteNotFound,
    scrollRestoration: true,
  });
}
export const router = createAppRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
