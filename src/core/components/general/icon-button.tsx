import type { ComponentProps } from 'react';
import { Button } from '@/core/components/ui/button';
import { cn } from '@/core/lib/utils';
import { Icon } from './icon';
import type { IconName } from '@/core/lib/assets';

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'children'> & {
  icon: IconName;
  label: string;
};

export function IconButton({
  icon,
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn('size-11', className)}
      {...props}
    >
      <Icon name={icon} />
    </Button>
  );
}
