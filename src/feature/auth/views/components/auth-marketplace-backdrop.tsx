import type { Nft } from '@/core/entities/nft.entity';
import { SiteHeader } from '@/core/components/general/site-header';
import { AuthCatalogCard } from './auth-catalog-card';
import { Hero } from '@/feature/home/views/components/hero';
import { CatalogFilters } from '@/feature/home/views/components/catalog-filters';
import { defaultCatalogSearch } from '@/feature/home/schemas/catalog-search.schema';
import type { CatalogResponse } from '@/feature/home/entities/catalog.entity';
import '@/feature/home/views/home.css';

/** The Figma intentionally places the auth panel over a marketplace specimen. */
export function AuthMarketplaceBackdrop({
  items,
  facets,
  onAction,
}: {
  items: readonly Nft[];
  facets: CatalogResponse['facets'];
  onAction: (label: string) => void;
}) {
  return (
    <div className="auth-marketplace-backdrop">
      <SiteHeader query="" onSearch={() => onAction('Busca')} />
      <div className="auth-backdrop-hero">
        <Hero description="Descubra NFTs selecionados de criadores do mundo todo e colecione arte digital verificada." />
      </div>
      <div className="auth-marketplace-catalog">
        <CatalogFilters
          search={defaultCatalogSearch}
          facets={facets}
          onChange={() => onAction('Filtros')}
        />
        <div>
          <div className="mb-6 flex items-center justify-between text-[15px]">
            <div className="flex gap-5">
              <span className="font-bold text-text-accent">Todos os NFTs</span>
              <span>Novos lançamentos</span>
              <span>Em alta</span>
            </div>
            <span className="text-[14px]">
              Ordenar por: Listados recentemente
            </span>
          </div>
          <div className="catalog-grid">
            {items.map((nft, index) => (
              <AuthCatalogCard
                key={nft.id}
                nft={nft}
                portrait={index === 3}
                showActions={index === 1}
                onAction={onAction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
