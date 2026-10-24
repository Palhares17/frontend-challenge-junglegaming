import type { Nft } from '@/core/entities/nft.entity';

export interface NftPresentation extends Nft {
  tokenId: string;
  collectionName: string;
  attributes: string;
  rating: string;
  ratingCount: number;
  description: string;
  mobileDescription: string;
  story: readonly string[];
  networkInfo: string;
  contractInfo: string;
  royaltyInfo: string;
  gallery: readonly { src: string; alt: string }[];
}
