import type { CSSProperties } from 'react';
import type { OrderLineItem } from '@/core/entities/order-presentation.entity';
import { NftItemIdentity } from '@/core/components/general/nft-item-identity';
import { QuantityControl } from '@/core/components/general/quantity-control';
import { EthPrice } from '@/core/components/general/eth-price';
import { Icon } from '@/core/components/general/icon';
import { figmaAssets } from '@/core/lib/figma-assets';

interface CartItemProps {
  item: OrderLineItem;
  highlightRemoval?: boolean;
  onQuantityChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  item,
  highlightRemoval,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <li
      className={`cart-item ${highlightRemoval ? 'cart-highlight-removal' : ''}`}
    >
      <div className="hidden lg:block">
        <NftItemIdentity item={item} />
      </div>
      <div
        className="cart-mobile-identity lg:hidden"
        style={{ '--cart-artwork': `url("${item.image}")` } as CSSProperties}
      >
        <NftItemIdentity item={item} edition />
        <EthPrice value={item.total} />
      </div>
      <p className="cart-unit-price hidden lg:block">{item.price} ETH</p>
      <QuantityControl
        max={'available' in item ? Number(item.available) : 99}
        value={item.quantity}
        onChange={(value) => onQuantityChange(item.id, value)}
        label={`Quantidade de ${item.name}`}
        muted
      />
      <EthPrice
        value={item.total}
        className="cart-line-total hidden lg:block"
      />
      <button
        type="button"
        aria-label={`Remover ${item.name}`}
        onClick={() => onRemove(item.id)}
        className="cart-remove"
      >
        <Icon
          asset={figmaAssets.cartDesktop.delete}
          className="hidden lg:block"
        />
        <Icon asset={figmaAssets.cartMobile.delete} className="lg:hidden" />
      </button>
    </li>
  );
}
