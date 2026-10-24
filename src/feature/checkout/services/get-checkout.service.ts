import { queryOptions } from '@tanstack/react-query';
import { api } from '@/core/services/api/api';
import type { CartData, CollectorProfile, Wallet, WalletConnection } from '@/core/entities/marketplace.entity';
export interface CheckoutResponse extends CartData {
  wallets: Wallet[];
  collector: CollectorProfile;
  connection: WalletConnection | null;
}
export const checkoutOptions = (userId: string) =>
  queryOptions({
    queryKey: ['private', userId, 'checkout'],
    queryFn: async ({ signal }) =>
      (await api.get<CheckoutResponse>('/checkout', { signal })).data,
  });
