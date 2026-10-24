import type { OrderLineItem } from '@/core/entities/order-presentation.entity';
import { NftItemIdentity } from './nft-item-identity';
import { EthPrice } from './eth-price';
import './order-summary.css';

export function OrderItems({
  items,
  receipt = false,
}: {
  items: readonly OrderLineItem[];
  receipt?: boolean;
}) {
  return (
    <div className={`order-items ${receipt ? 'receipt-items' : ''}`}>
      <div className="order-items-heading">
        <span>NFTs</span>
        {receipt && <span>Edições</span>}
        <span>Subtotal</span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="order-item">
            <NftItemIdentity item={item} />
            <span className="order-item-quantity">(x {item.quantity})</span>
            <EthPrice value={item.total} />
          </li>
        ))}
      </ul>
    </div>
  );
}
