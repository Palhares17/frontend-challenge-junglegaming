import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Skeleton } from '@/core/components/ui/skeleton';
import { MarketplaceShell } from '@/core/components/general/marketplace-shell';
import { MobileNavigation } from '@/core/components/general/mobile-navigation';
import { LoadRecovery } from '@/core/components/general/load-recovery';
import { usePageLoadError } from '@/core/hooks/use-page-load-error';
import { useProductNavigation } from './navigation';
import { defaultCatalogSearch } from '@/feature/home/schemas/catalog-search.schema';

export function RoutePending() {
  return (
    <main
      className="mx-auto max-w-content space-y-6 p-7"
      role="status"
      aria-label="Carregando página"
    >
      <span className="sr-only">Carregando página…</span>
      <Skeleton className="h-10 w-2/3" />
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </main>
  );
}
export function RouteNotFound() {
  return (
    <main className="mx-auto max-w-content space-y-6 p-7">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <Link
        to="/"
        search={defaultCatalogSearch}
        className="text-text-accent underline"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter();
  const boundary = useQueryErrorResetBoundary();
  const navigation = useProductNavigation();
  const [retrying, setRetrying] = useState(false);
  const missing = isAxiosError(error) && error.response?.status === 404;
  usePageLoadError(missing || retrying ? null : error, 'route-load-error');
  if (!missing) {
    async function retry() {
      if (retrying) return;
      setRetrying(true);
      boundary.reset();
      try {
        await router.invalidate();
      } finally {
        setRetrying(false);
      }
    }
    return (
      <MarketplaceShell onAction={(label) => navigation?.onAction(label)} footer={false}>
        <LoadRecovery onRetry={() => void retry()} pending={retrying}>
          <Link to="/" search={navigation?.catalogSearch ?? defaultCatalogSearch} className="text-text-accent underline">
            Voltar ao início
          </Link>
        </LoadRecovery>
        <MobileNavigation />
      </MarketplaceShell>
    );
  }
  return (
    <main className="mx-auto max-w-content space-y-6 p-7">
      <h1 className="text-2xl font-bold">
        Recurso não encontrado
      </h1>
      <p role="alert">
        Este NFT ou pedido não existe ou não está disponível para esta conta.
      </p>
      <Link
        to="/"
        search={defaultCatalogSearch}
        className="text-text-accent underline"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
