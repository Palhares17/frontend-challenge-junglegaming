import type { ComponentProps } from 'react';
import { cn } from '@/core/lib/utils';

export function NftArtwork({
  className,
  src,
  sizes,
  ...props
}: ComponentProps<'img'>) {
  return (
    <img
      src={src}
      srcSet={
        typeof src === 'string' && /^\/assets\/artwork\/[^/]+\.webp$/.test(src)
          ? [320, 640, 960]
              .map(
                (width) =>
                  `${src.replace('.webp', `-${width}.webp`)} ${width}w`,
              )
              .join(', ') + `, ${src} 1254w`
          : undefined
      }
      sizes={sizes ?? '(min-width: 1024px) 300px, calc((100vw - 64px) / 2)'}
      width={1254}
      height={1254}
      decoding="async"
      className={cn('block aspect-square object-cover', className)}
      {...props}
    />
  );
}
