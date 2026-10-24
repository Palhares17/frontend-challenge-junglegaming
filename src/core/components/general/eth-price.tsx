import { cn } from '@/core/lib/utils';

export function EthPrice({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={cn('font-bold text-text-accent tabular-nums', className)}>
      {value} ETH
    </span>
  );
}
