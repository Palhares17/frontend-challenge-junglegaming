import { createFileRoute } from '@tanstack/react-router';
import { privateRequest } from '../require-session';
import { checkoutOptions } from '@/feature/checkout/services/get-checkout.service';
import { CheckoutRoutePage } from '@/feature/checkout/views/checkout-route.page';
export const Route = createFileRoute('/_authenticated/checkout')({
  loader: ({ context, location }) =>
    privateRequest(
      context.queryClient.query(checkoutOptions(context.user.id)),
      context.queryClient,
      location.href,
    ),
  component: CheckoutRoutePage,
});
