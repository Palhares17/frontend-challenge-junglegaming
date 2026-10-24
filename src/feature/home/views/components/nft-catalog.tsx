import { useFavorites } from '@/feature/favorites/hooks/use-favorites';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { NftCard } from '@/core/components/general/nft-card';
import { CatalogPagination } from '@/core/components/general/catalog-pagination';
import { useCatalog } from '../../hooks/use-catalog';
import {
  defaultCatalogSearch,
  type CatalogSearch,
} from '../../schemas/catalog-search.schema';
import { CatalogToolbar } from './catalog-toolbar';
import { CatalogFilters } from './catalog-filters';
import { FeaturedNft } from './featured-nft';
import { CatalogFeedback } from './catalog-feedback';
import { CatalogSkeleton } from './catalog-skeleton';
import { usePageLoadError } from '@/core/hooks/use-page-load-error';
import { LoadRecovery } from '@/core/components/general/load-recovery';

interface NftCatalogProps {
  search: CatalogSearch;
  onChange: (patch: Partial<CatalogSearch>) => void;
}

export function NftCatalog({ search, onChange }: NftCatalogProps) {
  const query = useCatalog(search);
  usePageLoadError(query.isFetching ? null : query.error, 'catalog-load-error');
  const favorites = useFavorites();
  const notify = useUnavailable();
  return (
    <section
      id="catalogo"
      aria-label="Catálogo de NFTs"
      className="scroll-mt-6 lg:mt-section"
    >
      <h2 className="sr-only">Catálogo de NFTs</h2>
      <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[310px_minmax(0,1fr)]">
        <div className="hidden space-y-6 lg:block">
          <CatalogFilters
            search={search}
            facets={query.data?.facets}
            onChange={onChange}
          />
          <FeaturedNft onSelect={() => notify('Detalhes do NFT')} />
        </div>
        <div className="min-w-0">
          <CatalogToolbar search={search} onChange={onChange} />
          {query.isError && query.data && (
            <LoadRecovery onRetry={() => void query.refetch()} pending={query.isFetching} />
          )}
          <div className="mt-4 lg:mt-8" aria-busy={query.isFetching}>
            {query.isPending ? (
              <CatalogSkeleton />
            ) : query.isError && !query.data ? (
              <LoadRecovery onRetry={() => void query.refetch()} pending={query.isFetching} />
            ) : !query.data.items.length ? (
              <CatalogFeedback
                onRetry={() =>
                  onChange({ ...defaultCatalogSearch, collections: [] })
                }
              />
            ) : (
              <div className="catalog-grid">
                {query.data.items.map((nft, index) => (
                  <NftCard
                    key={nft.id}
                    nft={nft}
                    variant={index === 3 ? 'portrait' : 'default'}
                    showFavorite={index === 0 || favorites.contains(nft.id)}
                    favorite={favorites.contains(nft.id)}
                    favoritePending={favorites.pending}
                    onSelect={() => notify(`Detalhes de ${nft.name}`)}
                    onFavorite={() => favorites.toggle(nft)}
                  />
                ))}
              </div>
            )}
          </div>
          {query.isFetching && !query.isPending && (
            <p role="status" className="mt-4 text-xs text-text-secondary">
              Atualizando catálogo…
            </p>
          )}
          {query.data && (
            <div className="mt-12 lg:mt-[88px]">
              <CatalogPagination
                page={search.page}
                pages={Math.ceil(query.data.total / query.data.pageSize)}
                disabled={query.isPlaceholderData}
                onChange={(page) => onChange({ page })}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
