import type { FormEventHandler, ReactNode } from 'react';
import { LabeledInput } from '@/core/components/form/labeled-input';
import { Button } from '@/core/components/ui/button';
import { useMediaQuery } from '@/core/hooks/use-media-query';
import { figmaAssets } from '@/core/lib/figma-assets';

interface AuthFormProps {
  register: boolean;
  pending?: boolean;
  feedback?: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onRecover: () => void;
}

export function AuthForm({
  register,
  feedback,
  onSubmit,
  onRecover,
  pending,
}: AuthFormProps) {
  const desktop = useMediaQuery('(min-width:1024px)');
  const passwordIcon = desktop
    ? figmaAssets.loginDesktop.hide
    : figmaAssets.loginMobile.hide;
  return (
    <form onSubmit={onSubmit} className="auth-form" aria-busy={pending}>
      <div className="auth-fields">
        {register && (
          <LabeledInput
            label="Nome de usuário"
            name="username"
            autoComplete="username"
            placeholder="Nome de usuário"
            required
            hiddenLabel
          />
        )}
        <LabeledInput
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={register ? 'Digite seu e-mail' : 'contato@email.com'}
          required
          hiddenLabel
        />
        <LabeledInput
          label="Senha"
          name="password"
          type="password"
          passwordIcon={passwordIcon}
          autoComplete={register ? 'new-password' : 'current-password'}
          placeholder={register ? 'Senha' : '***********'}
          required
          hiddenLabel
          className={!register ? 'auth-login-password' : ''}
        />
        {register && (
          <LabeledInput
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            passwordIcon={passwordIcon}
            autoComplete="new-password"
            placeholder="Confirmar senha"
            required
            hiddenLabel
          />
        )}
        {!register && (
          <button type="button" className="auth-recover" onClick={onRecover}>
            Esqueceu a senha?
          </button>
        )}
      </div>
      {feedback}
      <Button type="submit" className="auth-submit" disabled={pending}>
        <span className="lg:hidden">
          {register ? 'Criar perfil' : 'Entrar'}
        </span>
        <span className="hidden lg:inline">
          {register ? 'Criar conta' : 'Entrar'}
        </span>
      </Button>
    </form>
  );
}
