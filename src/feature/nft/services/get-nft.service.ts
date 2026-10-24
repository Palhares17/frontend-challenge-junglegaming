import { queryOptions } from '@tanstack/react-query';
import { api } from '@/core/services/api/api';
import type { InventoryNft } from '@/core/entities/marketplace.entity';
import type { NftPresentation } from '../entities/nft-presentation.entity';
export interface NftDetailsResponse {
  nft: NftPresentation & InventoryNft;
  related: InventoryNft[];
}
export const nftOptions = (id: string) =>
  queryOptions({
    queryKey: ['nfts', 'detail', id],
    queryFn: async ({ signal }) =>
      (
        await api.get<NftDetailsResponse>(`/nfts/${encodeURIComponent(id)}`, {
          signal,
        })
      ).data,
  });
