export interface Nft {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  price: string;
  previousPrice?: string;
  collection: string;
  network: string;
  isNew: boolean;
  isTrending: boolean;
  isRare: boolean;
}
