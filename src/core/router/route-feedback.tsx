import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Skeleton } from '@/core/components/ui/skeleton';
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
  const missing = isAxiosError(error) && error.response?.status === 404;
  return (
    <main className="mx-auto max-w-content space-y-6 p-7">
      <h1 className="text-2xl font-bold">
        {missing
          ? 'Recurso não encontrado'
          : 'Não foi possível carregar a página'}
      </h1>
      <p role="alert">
        {missing
          ? 'Este NFT ou pedido não existe ou não está disponível para esta conta.'
          : 'Verifique sua conexão e tente novamente.'}
      </p>
      {!missing && (
        <button
          type="button"
          className="mr-6 text-text-accent underline"
          onClick={() => {
            boundary.reset();
            void router.invalidate();
          }}
        >
          Tentar novamente
        </button>
      )}
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
