import type { OrderLineItem } from '@/core/entities/order-presentation.entity';
import { NftArtwork } from './nft-artwork';

export function NftItemIdentity({
  item,
  edition = false,
}: {
  item: OrderLineItem;
  edition?: boolean;
}) {
  return (
    <div className="nft-item-identity">
      <NftArtwork src={item.image} alt={item.name} loading="lazy" />
      <div className="min-w-0">
        <h3 className="text-base leading-5 font-bold">{item.name}</h3>
        <p className="mt-1 text-sm leading-4 text-text-subtle">
          {edition ? `Edição: ${item.edition}` : `ID do token: ${item.tokenId}`}
        </p>
      </div>
    </div>
  );
}
