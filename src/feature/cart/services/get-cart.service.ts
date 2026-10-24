import { queryOptions } from "@tanstack/react-query";
import { api } from "@/core/services/api/api";
import type { CartData } from "@/core/entities/marketplace.entity";

export type CartResponse = CartData;

export const cartOptions = queryOptions({
  queryKey: ["cart"],
  // Shared with loaders: keep transport alive through StrictMode's temporary
  // observer unmount. Explicit cache cancellation still discards late responses.
  queryFn: async () => (await api.get<CartResponse>("/cart")).data,
  staleTime: 0,
});
