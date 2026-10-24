import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sessionOptions } from '@/core/session/session';
import { apiError } from '@/core/services/api/feedback';
import { changeCart } from '../services/cart-mutations.service';
import { cartOptions } from '../services/get-cart.service';
export function useCartMutation() {
  const client = useQueryClient();
  const sessionId = client.getQueryData(sessionOptions.queryKey)?.sessionId;
  return useMutation({
    mutationFn: changeCart,
    retry: false,
    onSuccess: async (data) => {
      if (client.getQueryData(sessionOptions.queryKey)?.sessionId !== sessionId)
        return;
      client.setQueryData(cartOptions.queryKey, data);
      await client.invalidateQueries({
        queryKey: ['private'],
        predicate: (q) => q.queryKey[2] === 'checkout',
      });
      toast.success('Carrinho atualizado.');
    },
    onError: (error) => toast.error(apiError(error).message),
  });
}
