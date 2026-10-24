import {
  catalogTabs,
  type CatalogSearch,
} from '../../schemas/catalog-search.schema';
import { CatalogSort } from './catalog-sort';

export function CatalogToolbar({
  search,
  onChange,
}: {
  search: CatalogSearch;
  onChange: (patch: Partial<CatalogSearch>) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-4 lg:h-[18px]">
      <div
        role="group"
        aria-label="Exibição do catálogo"
        className="flex max-w-full flex-wrap items-start gap-x-1 gap-y-2 text-sm leading-4 lg:gap-x-5 lg:text-[15px]"
      >
        {catalogTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            aria-pressed={search.tab === tab.value}
            onClick={() => onChange({ tab: tab.value })}
            className={`border-b-2 pb-0.5 text-left lg:pb-1 ${search.tab === tab.value ? 'border-primary font-bold text-text-accent' : 'border-transparent hover:text-text-accent'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="hidden lg:block">
        <CatalogSort search={search} onChange={onChange} />
      </div>
    </div>
  );
}
