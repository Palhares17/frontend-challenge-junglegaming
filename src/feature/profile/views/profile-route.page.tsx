import { useRef } from 'react';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useProductNavigation } from '@/core/router/navigation';
import { ApiFeedback } from '@/core/components/form/api-feedback';
import { apiError, formValues } from '@/core/services/api/feedback';
import { sessionOptions } from '@/core/session/session';
import {
  profileOptions,
  saveAvatar,
  savePassword,
  saveProfile,
} from '../services/profile.service';
import { ProfilePage } from './profile.page';
const route = getRouteApi('/_authenticated/account/profile');
export function ProfileRoutePage() {
  const { user } = route.useRouteContext();
  const navigation = useProductNavigation()!;
  const router = useRouter();
  const client = router.options.context.queryClient;
  const { data } = useSuspenseQuery(profileOptions(user.id));
  const file = useRef<HTMLInputElement>(null);
  const sessionId = client.getQueryData(sessionOptions.queryKey)?.sessionId;
  const active = () =>
    client.getQueryData(sessionOptions.queryKey)?.sessionId === sessionId;
  async function updated(profile: typeof data) {
    if (!active()) return;
    client.setQueryData(profileOptions(user.id).queryKey, profile);
    await client.invalidateQueries({ queryKey: ['session'] });
    await client.invalidateQueries({
      queryKey: ['private', user.id, 'checkout'],
    });
    toast.success('Perfil atualizado.');
  }
  const profile = useMutation({ mutationFn: saveProfile, onSuccess: updated });
  const avatar = useMutation({ mutationFn: saveAvatar, onSuccess: updated });
  const password = useMutation({
    mutationFn: savePassword,
    onSuccess: () => toast.success('Senha alterada.'),
  });
  return (
    <>
      <input
        ref={file}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label="Arquivo do avatar"
        className="sr-only"
        onChange={async (event) => {
          const selected = event.target.files?.[0];
          if (!selected) return;
          if (
            !['image/png', 'image/jpeg', 'image/webp'].includes(
              selected.type,
            ) ||
            selected.size > 740_000
          ) {
            toast.error('Envie PNG, JPEG ou WebP de até 740 KB.');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => avatar.mutate(String(reader.result));
          reader.onerror = () => toast.error('Não foi possível ler a imagem.');
          reader.readAsDataURL(selected);
          event.target.value = '';
        }}
      />
      <ProfilePage
        key={user.id}
        user={user}
        profile={data}
        onAction={navigation.onAction}
        pending={profile.isPending || avatar.isPending || password.isPending}
        feedback={<ApiFeedback error={profile.error ?? avatar.error} />}
        passwordFeedback={<ApiFeedback error={password.error} />}
        onAvatarChange={() => file.current?.click()}
        onAvatarRemove={() => avatar.mutate(null)}
        onSubmit={(event) => {
          event.preventDefault();
          const input = formValues(event.currentTarget);
          input.ens = input.ens ? input.ens.replace(/\.eth$/, '') + '.eth' : '';
          profile.mutate(input);
        }}
        onPasswordSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const input = formValues(form);
          password.mutate(
            { ...input, password: input.newPassword },
            {
              onSuccess: () => form.reset(),
              onError: (error) => toast.error(apiError(error).message),
            },
          );
        }}
      />
    </>
  );
}
