import { useEffect, useState } from 'react';
import { Input } from '@/core/components/ui/input';
import { Icon } from './icon';
import { cn } from '@/core/lib/utils';

interface SearchFieldProps {
  query: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchField({ query, onSearch, className }: SearchFieldProps) {
  const [value, setValue] = useState(query);
  useEffect(() => setValue(query), [query]);
  return (
    <form
      role="search"
      className={cn(
        'flex h-[45px] min-w-0 items-center rounded-input-mobile bg-card',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
    >
      <button
        type="submit"
        aria-label="Pesquisar NFTs"
        className="flex size-11 shrink-0 items-center justify-center rounded-input-mobile"
      >
        <Icon name="searchMobile" />
      </button>
      <Input
        aria-label="Buscar NFTs"
        autoComplete="off"
        placeholder="Explorar coleções"
        type="search"
        maxLength={100}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-full min-w-0 rounded-input-mobile border-0 bg-transparent pr-3 pl-0 text-sm font-bold placeholder:text-text-subtle dark:bg-transparent"
      />
    </form>
  );
}
