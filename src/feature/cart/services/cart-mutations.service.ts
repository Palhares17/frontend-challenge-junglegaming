import { api } from '@/core/services/api/api';
import type { CartData, EditionId } from '@/core/entities/marketplace.entity';

export type CartChange =
  | { type: 'add'; nftId: string; editionId: EditionId; quantity: number }
  | { type: 'quantity'; id: string; quantity: number }
  | { type: 'remove'; id: string }
  | { type: 'coupon'; code: string }
  | { type: 'removeCoupon' };

export async function changeCart(change: CartChange): Promise<CartData> {
  switch (change.type) {
    case 'add':
      return (await api.post<CartData>('/cart/items', change)).data;
    case 'quantity':
      return (
        await api.patch<CartData>(
          `/cart/items/${encodeURIComponent(change.id)}`,
          { quantity: change.quantity },
        )
      ).data;
    case 'remove':
      return (
        await api.delete<CartData>(
          `/cart/items/${encodeURIComponent(change.id)}`,
        )
      ).data;
    case 'coupon':
      return (await api.post<CartData>('/cart/coupon', { code: change.code }))
        .data;
    case 'removeCoupon':
      return (await api.delete<CartData>('/cart/coupon')).data;
  }
}
