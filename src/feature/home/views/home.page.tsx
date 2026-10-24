import { useNavigate, useSearch } from '@tanstack/react-router';
import { SiteHeader } from '@/core/components/general/site-header';
import { SiteFooter } from '@/core/components/general/site-footer';
import { MobileNavigation } from '@/core/components/general/mobile-navigation';
import {
  collectionOptions,
  type CatalogSearch,
} from '../schemas/catalog-search.schema';
import { Hero } from './components/hero';
import { NftCatalog } from './components/nft-catalog';
import { MobileCatalogSearch } from './components/mobile-catalog-search';
import { Promotions } from './components/promotions';
import { EditorialSection } from './components/editorial-section';
import './home.css';

const footerCollections = collectionOptions.filter((option) =>
  ['digital-art', 'photography', 'music', '3d-art', 'utility'].includes(
    option.value,
  ),
);

export function HomePage() {
  const search = useSearch({ from: '/' });
  return <CatalogHome search={search} />;
}

/** Shared with product authentication so its background keeps the catalog context. */
export function CatalogHome({ search }: { search: CatalogSearch }) {
  const navigate = useNavigate();
  function update(patch: Partial<CatalogSearch>) {
    void navigate({
      to: '/',
      search: { ...search, ...patch, page: patch.page ?? 1 },
      resetScroll: false,
    });
  }
  return (
    <div id="inicio" className="home-shell">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-button focus:bg-primary focus:p-3 focus:text-primary-foreground"
      >
        Ir para o conteúdo
      </a>
      <SiteHeader query={search.q} onSearch={(q) => update({ q })} />
      <main id="conteudo" className="space-y-4 lg:mt-8 lg:space-y-0">
        <MobileCatalogSearch search={search} onChange={update} />
        <Hero />
        <NftCatalog search={search} onChange={update} />
        <Promotions />
        <EditorialSection />
      </main>
      <SiteFooter
        collections={footerCollections}
        onCollection={(collection) => update({ collections: [collection] })}
      />
      <MobileNavigation />
    </div>
  );
}
