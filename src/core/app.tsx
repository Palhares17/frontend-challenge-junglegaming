import { QueryClientProvider } from '@tanstack/react-query';
import { RouterClient } from '@tanstack/react-router/ssr/client';
import { RouterProvider } from '@tanstack/react-router';
import { UnavailableProvider } from './providers/unavailable-provider';
import { router } from './router/router';
import { AppToaster } from './components/general/app-toaster';

export function App({
  appRouter = router,
  hydrating = false,
}: {
  appRouter?: typeof router;
  hydrating?: boolean;
}) {
  return (
    <QueryClientProvider client={appRouter.options.context.queryClient}>
      <UnavailableProvider>
        <AppToaster />
        {hydrating ? (
          <RouterClient router={appRouter} />
        ) : (
          <RouterProvider router={appRouter} />
        )}
      </UnavailableProvider>
    </QueryClientProvider>
  );
}
