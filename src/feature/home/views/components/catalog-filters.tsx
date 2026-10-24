import { Button } from '@/core/components/ui/button';
import {
  collectionOptions,
  networkOptions,
  type CatalogSearch,
} from '../../schemas/catalog-search.schema';
import type { CatalogResponse } from '../../entities/catalog.entity';
import { FilterGroup } from './filter-group';
import { PriceFilter } from './price-filter';

export interface CatalogFiltersProps {
  search: CatalogSearch;
  facets?: CatalogResponse['facets'];
  onChange: (patch: Partial<CatalogSearch>) => void;
  onApply?: () => void;
}

export function CatalogFilters({
  search,
  facets,
  onChange,
  onApply,
}: CatalogFiltersProps) {
  function toggle(field: 'collections' | 'networks', value: string) {
    const selected = search[field];
    onChange({
      [field]: selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    });
  }
  const changed =
    search.networks.length > 0 ||
    search.collections.length !== 1 ||
    search.collections[0] !== 'digital-art' ||
    search.min !== 2 ||
    search.max !== 1230;
  return (
    <div className="space-y-10 bg-card p-5">
      <FilterGroup
        title="Coleções"
        options={collectionOptions}
        selected={search.collections}
        counts={facets?.collections}
        onToggle={(value) => toggle('collections', value)}
      />
      <PriceFilter
        min={search.min}
        max={search.max}
        onApply={(min, max) => {
          onChange({ min, max });
          onApply?.();
        }}
      />
      <FilterGroup
        title="Rede"
        options={networkOptions}
        selected={search.networks}
        counts={facets?.networks}
        onToggle={(value) => toggle('networks', value)}
      />
      {changed && (
        <Button
          variant="ghost"
          className="w-full text-text-accent"
          onClick={() =>
            onChange({ collections: [], networks: [], min: 2, max: 1230 })
          }
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
