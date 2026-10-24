import { Button } from '@/core/components/ui/button';
import { QuantityControl } from '@/core/components/general/quantity-control';
import { Icon } from '@/core/components/general/icon';
import { EthPrice } from '@/core/components/general/eth-price';
import { figmaAssets } from '@/core/lib/figma-assets';

interface NftPurchaseControlsProps {
  quantity: number;
  maxQuantity?: number;
  favorite?: boolean;
  favoritePending?: boolean;
  pending?: boolean;
  onQuantityChange: (quantity: number) => void;
  price: string;
  onBuy: () => void;
  onFavorite: () => void;
  onAddToCart: () => void;
  mobile?: boolean;
}

export function NftPurchaseControls({
  quantity,
  maxQuantity, favorite, favoritePending, pending,
  onQuantityChange,
  price,
  onBuy,
  onFavorite,
  onAddToCart,
  mobile,
}: NftPurchaseControlsProps) {
  if (mobile)
    return (
      <section aria-label="Comprar NFT" className="nft-mobile-buy-bar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[15px] text-text-secondary">
            <span>Qtd.</span>
            <QuantityControl max={maxQuantity} value={quantity} onChange={onQuantityChange} />
          </div>
          <EthPrice value={price} className="text-xl" />
        </div>
        <div className="mt-3 flex gap-3">
          <Button
            disabled={pending || maxQuantity === 0}
            onClick={onBuy}
            className="mobile-primary-action w-[196px] max-w-[calc(100%-72px)]"
          >
            Comprar NFT
          </Button>
          <button
            type="button"
            disabled={pending || maxQuantity === 0}
            onClick={onAddToCart}
            aria-label="Adicionar ao carrinho"
            className="flex size-[60px] items-center justify-center rounded-full border border-border bg-surface-control"
          >
            <Icon asset={figmaAssets.nftMobile.shop} />
          </button>
        </div>
      </section>
    );
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <QuantityControl max={maxQuantity} value={quantity} onChange={onQuantityChange} large />
      {maxQuantity !== undefined && <button type="button" disabled={pending || maxQuantity === 0} onClick={onAddToCart} className="text-sm text-text-accent underline">Adicionar ao carrinho</button>}
      <div className="flex gap-2">
        <Button disabled={pending || maxQuantity === 0} onClick={onBuy} className="w-[130px] text-sm">
          COMPRAR
        </Button>
        <Button
          variant="outline"
          disabled={favoritePending}
          aria-pressed={favorite}
          onClick={onFavorite}
          className="w-[130px] gap-2 border-primary bg-transparent dark:bg-transparent dark:border-primary text-sm font-medium text-text-accent"
        >
          {favorite ? (
            <Icon name="heartFilled" />
          ) : (
            <Icon asset={figmaAssets.nftDesktop.heart1} />
          )}
          {favorite ? 'Favoritado' : 'Favoritar'}
        </Button>
      </div>
    </div>
  );
}
