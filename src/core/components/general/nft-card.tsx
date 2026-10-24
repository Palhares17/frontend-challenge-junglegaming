import { NftDetailsLink } from '@/core/router/navigation-links';
import type { Nft } from '@/core/entities/nft.entity';
import { NftArtwork } from './nft-artwork';
import { EthPrice } from './eth-price';
import { IconButton } from './icon-button';
import './nft-card.css';

interface NftCardProps {
  nft: Nft;
  onSelect: (nft: Nft) => void;
  onFavorite: () => void;
  showFavorite?: boolean;
  favorite?: boolean;
  favoritePending?: boolean;
  variant?: 'default' | 'portrait';
}

export function NftCard({
  nft,
  onSelect,
  onFavorite,
  showFavorite = false,
  variant = 'default',
  favorite, favoritePending,
}: NftCardProps) {
  return (
    <article
      className="nft-card group min-w-0"
      data-testid="nft-card"
      data-variant={variant}
    >
      <div className="nft-card-artwork relative">
        <NftDetailsLink
          nftId={nft.id}
          label={`Ver ${nft.name}`}
          onSelect={() => onSelect(nft)}
          className="flex size-full items-center justify-center rounded-[inherit]"
        >
          <NftArtwork
            src={nft.image}
            alt={nft.imageAlt}
            loading="lazy"
            className="nft-card-image"
          />
        </NftDetailsLink>
        {nft.isRare && (
          <span className="absolute top-4 left-0 h-8 w-[68px] bg-primary px-2 py-2 text-[13px] leading-4 font-medium text-primary-foreground lg:hidden">
            RARO
          </span>
        )}
        {showFavorite && (
          <IconButton
            icon="favorite"
            label={`Favoritar ${nft.name}`}
            onClick={onFavorite}
            aria-pressed={favorite}
            disabled={favoritePending}
            className="absolute top-1 right-0.5 rounded-full hover:bg-transparent lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
          />
        )}
      </div>
      <div className="nft-card-caption mt-2 px-2 lg:mt-3 lg:px-0">
        <h3 className="text-[15px] leading-5 lg:text-base lg:leading-4">
          <NftDetailsLink
            nftId={nft.id}
            className="text-left hover:text-text-accent"
            onSelect={() => onSelect(nft)}
          >
            {nft.name}
          </NftDetailsLink>
        </h3>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-base leading-4 lg:mt-3 lg:text-lg lg:leading-4">
          <EthPrice value={nft.price} />
          {nft.previousPrice && (
            <del className="text-text-subtle">{nft.previousPrice} ETH</del>
          )}
        </p>
      </div>
    </article>
  );
}
