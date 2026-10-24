import type { NftEdition } from '@/core/entities/marketplace.entity';
import type { Nft } from '@/core/entities/nft.entity';
import { MarketplaceShell } from '@/core/components/general/marketplace-shell';
import { NftCollectionStrip } from '@/core/components/general/nft-collection-strip';
import { EthPrice } from '@/core/components/general/eth-price';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';
import type { NftPresentation } from '../entities/nft-presentation.entity';
import { NftGallery } from './components/nft-gallery';
import { NftRating } from './components/nft-rating';
import { EditionSelector } from './components/edition-selector';
import { TokenInformation } from './components/token-information';
import { NftPurchaseControls } from './components/nft-purchase-controls';
import { NftDescription } from './components/nft-description';
import './nft-details.css';

interface NftDetailsPageProps {
  nft: NftPresentation;
  related: readonly Nft[];
  quantity: number;
  maxQuantity?: number;
  editions?: NftEdition[];
  favorite?: boolean;
  favoritePending?: boolean;
  pending?: boolean;
  edition: string;
  onQuantityChange: (quantity: number) => void;
  onEditionChange: (edition: string) => void;
  onAction: (label: string) => void;
}

export function NftDetailsPage({
  nft,
  maxQuantity, editions, favorite, favoritePending, pending,
  related,
  quantity,
  edition,
  onQuantityChange,
  onEditionChange,
  onAction,
}: NftDetailsPageProps) {
  const purchase = {
    quantity,
    maxQuantity, favorite, favoritePending, pending,
    onQuantityChange,
    price: nft.price,
    onBuy: () => onAction('Comprar NFT'),
    onFavorite: () => onAction('Favoritar NFT'),
    onAddToCart: () => onAction('Adicionar ao carrinho'),
  };
  return (
    <MarketplaceShell
      breadcrumbs={['Início', 'Mercado']}
      onAction={onAction}
      className="nft-details-shell"
    >
      <div className="nft-product">
        <NftGallery
          nft={nft}
          onBack={() => onAction('Voltar')}
          onFavorite={purchase.onFavorite}
          favorite={favorite}
        />
        <div className="nft-details-panel">
          <div>
            <div className="nft-title-row">
              <h1>{nft.name}</h1>
              <div className="lg:hidden">
                <NftRating rating={nft.rating} count={nft.ratingCount} />
              </div>
            </div>
            <div className="mt-3 hidden items-center justify-between gap-4 border-b border-border-soft pb-3 lg:flex">
              <EthPrice value={nft.price} className="text-[22px] leading-4" />
              <NftRating rating={nft.rating} count={nft.ratingCount} />
            </div>
          </div>
          <div className="nft-short-description">
            <h2 className="mb-3 hidden text-[15px] leading-4 font-bold lg:block">
              Sobre este NFT:
            </h2>
            <p className="hidden lg:block">{nft.description}</p>
            <p className="lg:hidden">{nft.mobileDescription}</p>
          </div>
          <EditionSelector editions={editions} value={edition} onChange={onEditionChange} />
          <div className="hidden lg:block">
            <NftPurchaseControls {...purchase} />
          </div>
          <div className="space-y-3">
            <TokenInformation nft={nft} />
            <div className="hidden items-center gap-2 leading-4 lg:flex">
              <span className="text-[15px] font-bold">
                Compartilhar este NFT:
              </span>
              {[
                figmaAssets.nftDesktop.linkedin,
                figmaAssets.nftDesktop.message,
                figmaAssets.nftDesktop.twitter,
              ].map((asset, index) => (
                <button
                  key={asset.src}
                  type="button"
                  onClick={() => onAction('Compartilhar NFT')}
                  aria-label={`Compartilhar via ${['LinkedIn', 'mensagem', 'Twitter'][index]}`}
                >
                  <Icon asset={asset} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NftDescription nft={nft} />
      <NftCollectionStrip
        title="Mais desta coleção"
        items={related}
        onAction={onAction}
      />
      <NftPurchaseControls {...purchase} mobile />
    </MarketplaceShell>
  );
}
