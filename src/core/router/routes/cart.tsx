import { createFileRoute } from '@tanstack/react-router';
import { cartOptions } from '@/feature/cart/services/get-cart.service';
import { CartRoutePage } from '@/feature/cart/views/cart-route.page';
export const Route = createFileRoute('/cart')({
  loader: ({ context }) => context.queryClient.query(cartOptions),
  component: CartRoutePage,
});
