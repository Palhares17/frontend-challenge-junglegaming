/** Presentation contracts only. Quotes and confirmed-order snapshots will be wired later. */
export interface OrderLineItem {
  id: string;
  name: string;
  tokenId: string;
  image: string;
  edition: string;
  quantity: number;
  price: string;
  total: string;
}

export interface OrderTotals {
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
}
