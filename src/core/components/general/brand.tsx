import { CatalogLink } from '@/core/router/navigation-links';
import { cn } from '@/core/lib/utils';

export function Brand({ className }: { className?: string }) {
  return (
    <CatalogLink
      label="Kurio — início"
      className={cn(
        'inline-flex items-center text-brand font-bold tracking-brand',
        className,
      )}
    >
      KURIO
    </CatalogLink>
  );
}
