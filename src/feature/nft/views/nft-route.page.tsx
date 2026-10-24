import { useCartMutation } from '@/feature/cart/hooks/use-cart-mutation';
import { useFavorites } from '@/feature/favorites/hooks/use-favorites';
import type { EditionId } from '@/core/entities/marketplace.entity';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { nftOptions } from '../services/get-nft.service';
import { NftDetailsPage } from './nft-details.page';
const route = getRouteApi('/nfts/$nftId');
export function NftRoutePage() {
  const { nftId } = route.useParams();
  const { data } = useSuspenseQuery(nftOptions(nftId));
  return <NftDetails key={nftId} data={data} />;
}
function NftDetails({
  data,
}: {
  data: import('../services/get-nft.service').NftDetailsResponse;
}) {
  const navigation = useProductNavigation()!;
  const mutation = useCartMutation();
  const favorites = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [edition, setEdition] = useState('fifty');
  const available = data.nft.editions.find(item => item.id === edition)?.available ?? 0;
  function action(label: string) {
    if (label === 'Favoritar NFT') return favorites.toggle(data.nft);
    if (label === 'Comprar NFT' || label === 'Adicionar ao carrinho') {
      if (mutation.isPending || !available) return;
      mutation.mutate({ type: 'add', nftId: data.nft.id, editionId: edition as EditionId, quantity: Math.min(quantity, available) }, { onSuccess: () => { if (label === 'Comprar NFT') navigation.onAction('Carrinho'); } });
    } else navigation.onAction(label);
  }
  return (
    <NftDetailsPage
      {...data}
      quantity={Math.min(quantity, Math.max(1, available))}
      maxQuantity={available}
      editions={data.nft.editions}
      favorite={favorites.contains(data.nft.id)}
      favoritePending={favorites.pending}
      pending={mutation.isPending}
      edition={edition}
      onQuantityChange={setQuantity}
      onEditionChange={value => { setEdition(value); setQuantity(1); }}
      onAction={action}
    />
  );
}
