import type { ComponentProps } from 'react';
import { cn } from '@/core/lib/utils';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
