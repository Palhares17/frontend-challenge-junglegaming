import { createFileRoute, Outlet } from '@tanstack/react-router';
import { privateRequest } from '../require-session';
import { orderOptions } from '@/feature/orders/services/get-order.service';
export const Route = createFileRoute('/_authenticated/orders/$orderId')({
  loader: ({ context, params, location }) =>
    privateRequest(
      context.queryClient.query(orderOptions(context.user.id, params.orderId)),
      context.queryClient,
      location.href,
    ),
  component: Outlet,
});
