import type {
  OrderLineItem,
  OrderTotals,
} from '@/core/entities/order-presentation.entity';

/** Caller supplies an explicit design specimen or a confirmed immutable snapshot. */
export interface OrderReceiptPresentation {
  status: 'confirmed';
  transactionId: string;
  date: string;
  wallet: string;
  items: readonly OrderLineItem[];
  totals: OrderTotals;
  note: string;
}
