import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/core/services/api/api';
import { ApiFeedback } from '@/core/components/form/api-feedback';
import { useProductNavigation } from '@/core/router/navigation';
import { safeRedirect } from '@/core/router/redirect';
import {
  clearPrivateCache,
  login,
  sessionOptions,
} from '@/core/session/session';
import { catalogOptions } from '@/feature/home/hooks/use-catalog';
import { CatalogHome } from '@/feature/home/views/home.page';
import { AuthScreen } from './components/auth-screen';

const loginErrorToastId = 'login-error';

export function AuthRoutePage({
  mode,
  redirectTo,
}: {
  mode: 'login' | 'register';
  redirectTo: string;
}) {
  const router = useRouter();
  const client = router.options.context.queryClient;
  const navigation = useProductNavigation()!;
  const { data } = useSuspenseQuery(catalogOptions(navigation.catalogSearch));
  useEffect(() => () => toast.remove(loginErrorToastId), [mode]);
  const mutation = useMutation({
    meta: { public: true },
    onMutate: () => {
      toast.remove(loginErrorToastId);
      return client.cancelQueries({ queryKey: sessionOptions.queryKey });
    },
    mutationFn: async (input: Record<string, string>) => {
      if (mode === 'register') await api.post('/accounts', input);
      return login(input.email, input.password);
    },
    onSuccess: async (session) => {
      await clearPrivateCache(client);
      client.setQueryData(sessionOptions.queryKey, session);
      await router.navigate({ href: safeRedirect(redirectTo), replace: true });
    },
  });
  return (
    <AuthScreen
      background={<CatalogHome search={navigation.catalogSearch} />}
      mode={mode}
      items={data.items}
      facets={data.facets}
      pending={mutation.isPending}
      returnTo={redirectTo}
      onAction={navigation.onAction}
      onClose={() => {
        void router
          .navigate({
            to: '/',
            search: navigation.catalogSearch,
            resetScroll: false,
          })
          .then(() => {
            requestAnimationFrame(() => {
              document
                .querySelector<HTMLElement>('[data-auth-trigger]')
                ?.focus({ preventScroll: true });
            });
          });
      }}
      onSwitch={() => {
        void router.navigate({
          to: mode === 'login' ? '/register' : '/login',
          search: { redirect: redirectTo },
          resetScroll: false,
        });
      }}
      feedback={<ApiFeedback error={mode === 'register' ? mutation.error : null} />}
      onSubmit={(event) => {
        event.preventDefault();
        if (mutation.isPending) return;
        const form = new FormData(event.currentTarget);
        mutation.mutate(
          Object.fromEntries(form.entries()) as Record<string, string>,
          {
            // Per-submit callbacks are skipped if this screen unmounts first.
            onError: (error) => {
              if (mode === 'register') return;
              toast.error(
                isAxiosError(error) && error.response?.status === 401
                  ? 'E-mail ou senha inválidos.'
                  : 'Não foi possível entrar. Tente novamente.',
                {
                  id: loginErrorToastId,
                  ariaProps: { role: 'alert', 'aria-live': 'assertive' },
                },
              );
            },
          },
        );
      }}
    />
  );
}
