import { createFileRoute } from '@tanstack/react-router';
import { OrderRoutePage } from '@/feature/orders/views/order-route.page';
export const Route = createFileRoute(
  '/_authenticated/orders/$orderId/confirmation',
)({ component: OrderRoutePage });
