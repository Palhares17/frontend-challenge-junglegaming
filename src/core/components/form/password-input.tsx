import { useState, type ComponentProps } from 'react';
import { Input } from '@/core/components/ui/input';
import type { VisualAsset } from '@/core/lib/figma-assets';
import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from '@/core/components/general/icon';
import { cn } from '@/core/lib/utils';

export function PasswordInput({
  className,
  icon = figmaAssets.profileDesktop.hide,
  ...props
}: Omit<ComponentProps<typeof Input>, 'type'> & { icon?: VisualAsset }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative min-w-0">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
        className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-input"
      >
        <Icon asset={icon} />
      </button>
    </div>
  );
}
