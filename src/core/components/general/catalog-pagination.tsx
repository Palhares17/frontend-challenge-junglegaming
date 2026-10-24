import { Button } from '@/core/components/ui/button';
import { Icon } from './icon';

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

export function CatalogPagination({
  page,
  pages,
  onChange,
  disabled,
}: PaginationProps) {
  if (pages <= 1) return null;
  const start = Math.max(1, Math.min(page - 1, pages - 3));
  const numbers = Array.from(
    { length: Math.min(4, pages) },
    (_, i) => start + i,
  );
  return (
    <nav
      aria-label="Paginação dos NFTs"
      className="flex flex-wrap justify-end gap-2"
    >
      {page > 1 && (
        <Button
          variant="outline"
          size="icon"
          aria-label="Página anterior"
          disabled={disabled}
          onClick={() => onChange(page - 1)}
        >
          <Icon name="next" className="rotate-90" />
        </Button>
      )}
      {numbers.map((number) => (
        <Button
          key={number}
          variant={page === number ? 'default' : 'outline'}
          className="size-10 rounded-pagination p-0 text-lg lg:size-[35px]"
          aria-label={`Página ${number}`}
          aria-current={page === number ? 'page' : undefined}
          disabled={disabled}
          onClick={() => onChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        className="size-10 rounded-pagination p-0 lg:size-[35px]"
        aria-label="Próxima página"
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        <Icon name="next" className="-rotate-90" />
      </Button>
    </nav>
  );
}
