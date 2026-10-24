import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductNavigation } from "@/core/router/navigation";
import { cartOptions } from "../services/get-cart.service";
import { useCartMutation } from "../hooks/use-cart-mutation";
import { CartPage } from "./cart.page";

export function CartRoutePage() {
  const { data } = useSuspenseQuery(cartOptions);
  const navigation = useProductNavigation()!;
  const mutation = useCartMutation();
  
  return (
    <div aria-busy={mutation.isPending}>
      <fieldset disabled={mutation.isPending} className="cart-live min-w-0">
        <CartPage
          {...data}
          onAction={navigation.onAction}
          onQuantityChange={(id, quantity) =>
            mutation.mutate({ type: "quantity", id, quantity })
          }
          onRemove={(id) => mutation.mutate({ type: "remove", id })}
          onRemoveCoupon={() => mutation.mutate({ type: "removeCoupon" })}
          onCoupon={(event) => {
            event.preventDefault();
            mutation.mutate({
              type: "coupon",
              code: String(
                new FormData(event.currentTarget).get("coupon") ?? "",
              ),
            });
          }}
        />
      </fieldset>
    </div>
  );
}
