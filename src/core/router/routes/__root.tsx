import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { RouterContext } from '../context';
import { ProductNavigation } from '../navigation';
import { RouteError, RouteNotFound, RoutePending } from '../route-feedback';
export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  pendingComponent: RoutePending,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});
function Root() {
  return (
    <ProductNavigation>
      <Outlet />
    </ProductNavigation>
  );
}
