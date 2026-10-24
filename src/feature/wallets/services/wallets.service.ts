import { queryOptions } from "@tanstack/react-query";
import type { Wallet } from "@/core/entities/marketplace.entity";
import { api } from "@/core/services/api/api";

export const walletsOptions = (userId: string) =>
  queryOptions({
    queryKey: ["private", userId, "wallets"],
    queryFn: async ({ signal }) =>
      (await api.get<{ items: Wallet[] }>("/wallets", { signal })).data,
  });
  
export const saveWallet = async ({
  id,
  ...input
}: Omit<Wallet, "id"> & { id?: string }) =>
  (
    await api.request<Wallet>({
      method: id ? "PATCH" : "POST",
      url: id ? `/wallets/${encodeURIComponent(id)}` : "/wallets",
      data: input,
    })
  ).data;
