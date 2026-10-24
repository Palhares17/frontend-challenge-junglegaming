import type { SessionUser } from '@/core/session/session';
import type { CollectorProfile } from '@/core/entities/marketplace.entity';
import type { ReactNode, FormEventHandler } from 'react';
import { AccountShell } from '@/core/components/general/account-shell';
import { LabeledInput } from '@/core/components/form/labeled-input';
import { EnsInput } from '@/core/components/form/ens-input';
import { Button } from '@/core/components/ui/button';
import { AvatarField } from './components/avatar-field';
import { ChangePasswordFields } from './components/change-password-fields';

interface ProfilePageProps {
  user?: SessionUser;
  profile?: CollectorProfile;
  feedback?: ReactNode;
  passwordFeedback?: ReactNode;
  pending?: boolean;
  onAvatarChange?: () => void;
  onAvatarRemove?: () => void;
  onPasswordSubmit?: FormEventHandler<HTMLFormElement>;
  onAction: (label: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function ProfilePage({ onAction, onSubmit, user, profile, feedback, passwordFeedback, pending, onAvatarChange, onAvatarRemove, onPasswordSubmit }: ProfilePageProps) {
  return (
    <AccountShell
      title="Perfil do colecionador"
      active="profile"
      onAction={onAction}
    >
      <form onSubmit={onSubmit} aria-busy={pending}>
        <fieldset disabled={pending} className="min-w-0">
        <h1 className="account-heading mb-8 hidden lg:block">
          Perfil do colecionador
        </h1>
        <div className="form-grid">
          <LabeledInput
            label="Nome de exibição"
            name="displayName"
            defaultValue={profile?.displayName ?? user?.name}
            autoComplete="nickname"
            required
          />
          <LabeledInput
            label="Nome de usuário"
            name="username"
            defaultValue={profile?.username}
            autoComplete="username"
            required
          />
          <LabeledInput
            label="E-mail"
            name="email"
            defaultValue={profile?.email ?? user?.email}
            autoComplete="email"
            type="email"
            required
          />
          <EnsInput required={!profile} defaultValue={profile?.ens.replace(/\.eth$/, '')} />
          <LabeledInput
            label="Apelido da carteira"
            name="walletAlias"
            defaultValue={profile?.walletAlias}
            autoComplete="off"
            required={!profile}
          />
          <AvatarField
            avatar={profile?.avatar ?? undefined}
            onChange={onAvatarChange ?? (() => onAction('Alterar avatar'))}
            onRemove={onAvatarRemove ?? (() => onAction('Remover avatar'))}
          />
        </div>
        {!onPasswordSubmit && <ChangePasswordFields />}
        {feedback}
        <Button
          type="submit"
          className="mt-8 h-10 min-w-[130px] rounded-input text-[15px]"
        >
          Salvar
        </Button>
        </fieldset>
      </form>
      {onPasswordSubmit && <form onSubmit={onPasswordSubmit}><fieldset disabled={pending}><ChangePasswordFields />{passwordFeedback}<Button type="submit" className="mt-6">Alterar senha</Button></fieldset></form>}
    </AccountShell>
  );
}
