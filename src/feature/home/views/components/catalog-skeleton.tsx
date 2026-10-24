import { Skeleton } from '@/core/components/ui/skeleton';

export function CatalogSkeleton() {
  return (
    <div role="status" aria-label="Carregando NFTs">
      <span className="sr-only">Carregando NFTs…</span>
      <div className="catalog-grid" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index}>
            <Skeleton className="nft-card-artwork" />
            <Skeleton className="mt-2 h-5 w-4/5 lg:mt-3 lg:h-4" />
            <Skeleton className="h-4 w-1/2 lg:mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
