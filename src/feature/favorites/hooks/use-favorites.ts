import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useRouterState } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import type { Nft } from '@/core/entities/nft.entity';
import { api } from '@/core/services/api/api';
import { apiError } from '@/core/services/api/feedback';
import { sessionOptions } from '@/core/session/session';
export function useFavorites() {
  const client = useQueryClient();
  const router = useRouter();
  const href = useRouterState({ select: (s) => s.location.href });
  const { data: session, isPending: sessionPending } = useQuery(sessionOptions);
  const userId = session?.user?.id;
  const key = ['private', userId, 'favorites'] as const;
  const query = useQuery({
    queryKey: key,
    enabled: !!userId,
    queryFn: async ({ signal }) =>
      (await api.get<{ items: Nft[] }>('/favorites', { signal })).data,
  });
  const currentSession = () =>
    client.getQueryData(sessionOptions.queryKey)?.sessionId ===
    session?.sessionId;
  const mutation = useMutation({
    mutationFn: async ({ nft, remove }: { nft: Nft; remove: boolean }) => {
      const url = `/favorites/${encodeURIComponent(nft.id)}`;
      if (remove) await api.delete(url);
      else await api.put(url);
    },
    onMutate: async ({ nft, remove }) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<{ items: Nft[] }>(key);
      client.setQueryData(key, {
        items: remove
          ? (previous?.items ?? []).filter((item) => item.id !== nft.id)
          : [...(previous?.items ?? []), nft],
      });
      return { previous };
    },
    onError: (error, _, context) => {
      if (currentSession())
        client.setQueryData(key, context?.previous ?? { items: [] });
      toast.error(apiError(error).message);
    },
    onSettled: () => {
      if (currentSession()) return client.invalidateQueries({ queryKey: key });
    },
  });
  const contains = (id: string) =>
    !!query.data?.items.some((item) => item.id === id);
  return {
    items: query.data?.items ?? [],
    loading: !!userId && query.isPending,
    error: query.error,
    retry: query.refetch,
    contains,
    pending: sessionPending || mutation.isPending || (!!userId && query.isPending),
    toggle: (nft: Nft) => {
      if (!userId) {
        void router.navigate({ to: '/login', search: { redirect: href } });
        return;
      }
      if (!mutation.isPending && !query.isPending && !query.isError)
        mutation.mutate({ nft, remove: contains(nft.id) });
      else if (query.isError) {
        toast.error('Não foi possível carregar favoritos. Tente novamente.');
        void query.refetch();
      }
    },
  };
}
