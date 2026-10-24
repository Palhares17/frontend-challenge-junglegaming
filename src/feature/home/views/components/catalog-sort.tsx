import { useId } from 'react';
import {
  sortOptions,
  type CatalogSearch,
} from '../../schemas/catalog-search.schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';

export function CatalogSort({
  search,
  onChange,
}: {
  search: CatalogSearch;
  onChange: (patch: Partial<CatalogSearch>) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-1 text-sm lg:h-[18px] lg:text-[15px]">
      <span id={id}>Ordenar por:</span>
      <Select
        value={search.sort}
        onValueChange={(value) => {
          if (value) onChange({ sort: value });
        }}
        items={sortOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      >
        <SelectTrigger
          aria-labelledby={id}
          className="min-h-8 border-0 bg-transparent p-0 text-inherit shadow-none dark:bg-transparent dark:hover:bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="end"
          className="min-w-[240px]"
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
