import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { api } from "@/core/services/api/api";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
export interface Session {
  sessionId?: string;
  user: SessionUser | null;
}
export const sessionOptions = queryOptions({
  queryKey: ["session"],
  // Guards and the root observer share this request. Keep it alive through
  // StrictMode's temporary observer unmount while beforeLoad still awaits it.
  queryFn: async (): Promise<Session> =>
    (await api.get<Session>("/session")).data,
  staleTime: 0,
  retry: false,
  refetchOnWindowFocus: "always",
});

export async function clearPrivateCache(client: QueryClient) {
  await client.cancelQueries({ queryKey: ["private"] });
  client.removeQueries({ queryKey: ["private"] });
  await client.cancelQueries({ queryKey: ["cart"] });
  client.removeQueries({ queryKey: ["cart"] });
}

export async function login(email: string, password: string) {
  return (await api.post<Session>("/session", { email, password })).data;
}

export async function logout() {
  await api.delete("/session");
}
