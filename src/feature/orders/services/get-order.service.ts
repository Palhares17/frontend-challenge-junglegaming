import { queryOptions } from '@tanstack/react-query';
import { api } from '@/core/services/api/api';
import type { OrderReceiptPresentation } from '../entities/order-receipt-presentation.entity';
export type OrderResponse = { id: string } & (
  | { status: 'confirmed'; receipt: OrderReceiptPresentation }
  | { status: 'pending' | 'declined' }
);
export const orderOptions = (userId: string, id: string) =>
  queryOptions<OrderResponse>({
    queryKey: ['private', userId, 'order', id],
    refetchInterval: query => query.state.data?.status === 'pending' ? 2000 : false,
    queryFn: async ({ signal }) =>
      (
        await api.get<OrderResponse>(`/orders/${encodeURIComponent(id)}`, {
          signal,
        })
      ).data,
  });
