import type { Nft } from './nft.entity';
import type { OrderLineItem, OrderTotals } from './order-presentation.entity';

export type Network = 'ethereum' | 'polygon' | 'solana';

export type EditionId = 'single' | 'ten' | 'fifty' | 'open';

export interface NftEdition {
  id: EditionId;
  label: string;
  available: number;
}
export interface InventoryNft extends Nft {
  version: number;
  editions: NftEdition[];
}
export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}
export interface CollectorProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  ens: string;
  walletAlias: string;
  avatar: string | null;
}
export interface Wallet {
  id: string;
  label: string;
  address: string;
  network: Network;
  primary: boolean;
}
export interface WalletConnection {
  walletId: string;
  network: Network;
  status: 'connected' | 'disconnected';
}
export interface CartEntry {
  id: string;
  nftId: string;
  editionId: EditionId;
  quantity: number;
}
export interface CartLine extends OrderLineItem {
  nftId: string;
  editionId: EditionId;
  available: number;
  nftVersion: number;
}
export interface CartData {
  version: number;
  items: CartLine[];
  totals: OrderTotals;
  coupon: string | null;
  couponError: 'COUPON_INVALID' | 'COUPON_EXPIRED' | null;
  related: InventoryNft[];
}
export interface Quote {
  id: string;
  ownerId: string;
  fingerprint: string;
  expiresAt: number;
  items: CartLine[];
  totals: OrderTotals;
  coupon: string | null;
}
export interface CreateOrderInput {
  quoteId: string;
  walletId: string;
  network: Network;
  collector: { displayName: string; email: string; notes?: string };
}
export type OrderStatus = 'pending' | 'confirmed' | 'declined';
export interface MarketplaceEvent {
  eventId: string;
  resourceId: string;
  version: number;
  data: InventoryNft | { id: string; status: OrderStatus };
}
export interface ServerEvents {
  'nft.updated': (event: MarketplaceEvent) => void;
  'order.updated': (event: MarketplaceEvent) => void;
  'session.expired': () => void;
}
export interface ClientEvents {
  'session.check': () => void;
}
