import { icons, type IconName } from '@/core/lib/assets';
import { cn } from '@/core/lib/utils';
import type { VisualAsset } from '@/core/lib/figma-assets';

type IconProps = (
  { name: IconName; asset?: never } | { asset: VisualAsset; name?: never }
) & { className?: string };

export function Icon({ name, asset, className }: IconProps) {
  const icon = asset ?? icons[name!];
  return (
    <img
      src={icon.src}
      width={icon.width}
      height={icon.height}
      alt=""
      aria-hidden="true"
      className={cn('shrink-0', className)}
    />
  );
}
