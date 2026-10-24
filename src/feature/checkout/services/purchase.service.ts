import { api } from '@/core/services/api/api';
import type {
  CreateOrderInput,
  Quote,
  WalletConnection,
  Network,
} from '@/core/entities/marketplace.entity';
import type { OrderResponse } from '@/feature/orders/services/get-order.service';
export interface PurchaseAttempt {
  key: string;
  input: CreateOrderInput;
  orderId?: string;
}
const storageKey = (userId: string) => `kurio:purchase:${userId}`;
export function readAttempt(userId: string): PurchaseAttempt | null {
  try {
    const raw = JSON.parse(
      sessionStorage.getItem(storageKey(userId)) ?? 'null',
    );
    return raw &&
      typeof raw.key === 'string' &&
      typeof raw.input?.quoteId === 'string'
      ? raw
      : null;
  } catch {
    return null;
  }
}
export function writeAttempt(userId: string, attempt: PurchaseAttempt | null) {
  if (attempt)
    sessionStorage.setItem(storageKey(userId), JSON.stringify(attempt));
  else sessionStorage.removeItem(storageKey(userId));
}
export const requestQuote = async () => (await api.post<Quote>('/quotes')).data;
export const connectWallet = async (walletId: string, network: Network) =>
  (
    await api.post<WalletConnection>('/wallet-connection', {
      walletId,
      network,
    })
  ).data;
export const disconnectWallet = async () => {
  await api.delete('/wallet-connection');
};
export const submitPurchase = async (attempt: PurchaseAttempt) =>
  (
    await api.post<OrderResponse>('/orders', attempt.input, {
      headers: { 'Idempotency-Key': attempt.key },
      timeout: 5000,
    })
  ).data;
