import type { Nft } from '@/core/entities/nft.entity';
import { NftCard } from './nft-card';
import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from './icon';
import './nft-collection-strip.css';

export function NftCollectionStrip({
  title,
  items,
  onAction,
}: {
  title: string;
  items: readonly Nft[];
  onAction: (label: string) => void;
}) {
  return (
    <section className="collection-strip">
      <h2 className="border-b border-border-soft pb-3 text-[17px] leading-6 font-bold text-text-accent">
        {title}
      </h2>
      <div className="collection-strip-grid">
        {items.map((nft, index) => (
          <NftCard
            key={nft.id}
            nft={nft}
            variant={index === 0 ? 'portrait' : 'default'}
            onSelect={() => onAction(`Detalhes de ${nft.name}`)}
            onFavorite={() => onAction('Favoritos')}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Icon asset={figmaAssets.nftDesktop.carouselDots} />
      </div>
    </section>
  );
}
