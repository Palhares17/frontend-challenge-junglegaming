import { createFileRoute } from '@tanstack/react-router';
import { nftOptions } from '@/feature/nft/services/get-nft.service';
import { NftRoutePage } from '@/feature/nft/views/nft-route.page';
export const Route = createFileRoute('/nfts/$nftId')({
  loader: ({ context, params }) =>
    context.queryClient.query(nftOptions(params.nftId)),
  component: NftRoutePage,
});
