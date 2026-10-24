import { SearchField } from '@/core/components/general/search-field';
import { useCatalog } from '../../hooks/use-catalog';
import type { CatalogSearch } from '../../schemas/catalog-search.schema';
import { MobileFilters } from './mobile-filters';

interface MobileCatalogSearchProps {
  search: CatalogSearch;
  onChange: (patch: Partial<CatalogSearch>) => void;
}

export function MobileCatalogSearch({
  search,
  onChange,
}: MobileCatalogSearchProps) {
  const { data } = useCatalog(search);
  return (
    <div className="flex min-w-0 gap-2 lg:hidden">
      <SearchField
        query={search.q}
        onSearch={(q) => onChange({ q })}
        className="flex-1"
      />
      <MobileFilters
        search={search}
        facets={data?.facets}
        onChange={onChange}
      />
    </div>
  );
}
