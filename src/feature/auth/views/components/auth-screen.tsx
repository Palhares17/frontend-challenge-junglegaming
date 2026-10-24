import type { FormEventHandler, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import type { Nft } from '@/core/entities/nft.entity';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/core/components/ui/dialog';
import { Icon } from '@/core/components/general/icon';
import { Brand } from '@/core/components/general/brand';
import { figmaAssets } from '@/core/lib/figma-assets';
import { useMediaQuery } from '@/core/hooks/use-media-query';
import type { CatalogResponse } from '@/feature/home/entities/catalog.entity';
import { AuthMarketplaceBackdrop } from './auth-marketplace-backdrop';
import { AuthForm } from './auth-form';
import { SocialAuthOptions } from './social-auth-options';
import '../auth.css';

export interface AuthScreenProps {
  background?: ReactNode;
  pending?: boolean;
  feedback?: ReactNode;
  returnTo?: string;
  mode: 'login' | 'register';
  items: readonly Nft[];
  facets: CatalogResponse['facets'];
  onAction: (label: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onSwitch: () => void;
  onClose: () => void;
}

export function AuthScreen({
  background,
  feedback,
  mode,
  items,
  facets,
  onAction,
  onSubmit,
  onSwitch,
  onClose,
  pending,
  returnTo = '/',
}: AuthScreenProps) {
  const navigation = useProductNavigation();
  const desktop = useMediaQuery('(min-width:1024px)');
  const register = mode === 'register';
  const switchControl = (children: ReactNode, className?: string) =>
    navigation ? (
      <Link
        to={register ? '/login' : '/register'}
        search={{ redirect: returnTo }}
        resetScroll={false}
        className={className}
      >
        {children}
      </Link>
    ) : (
      <button type="button" className={className} onClick={onSwitch}>
        {children}
      </button>
    );
  const form = (
    <>
      {pending && (
        <p role="status" className="sr-only">
          Entrando…
        </p>
      )}
      <AuthForm
        register={register}
        feedback={feedback}
        pending={pending}
        onSubmit={onSubmit}
        onRecover={() => onAction('Recuperação de senha')}
      />
      <SocialAuthOptions
        register={register}
        onSocial={(provider) =>
          onAction(
            `Entrar com ${provider === 'google' ? 'Google' : 'Facebook'}`,
          )
        }
      />
    </>
  );
  if (!desktop)
    return (
      <main
        className={`auth-mobile ${register ? 'auth-register' : 'auth-login'}`}
      >
        <div className="auth-mobile-brand">
          <Brand className="text-brand-mobile" />
        </div>
        <h1>{register ? 'Criar perfil de colecionador' : 'Entrar'}</h1>
        {form}
        {switchControl(
          register
            ? 'Já tem uma conta? Entre'
            : 'Novo na Kurio? Crie uma conta',
          'auth-mobile-switch',
        )}
        {navigation && (
          <button
            type="button"
            onClick={onClose}
            className="mt-5 text-sm underline"
          >
            Voltar ao catálogo
          </button>
        )}
      </main>
    );
  return (
    <>
      {background ?? (
        <AuthMarketplaceBackdrop
          items={items}
          facets={facets}
          onAction={onAction}
        />
      )}
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent
          positioning="custom"
          initialFocus={navigation ? true : false}
          showCloseButton={false}
          className={`auth-desktop-panel ${register ? 'auth-register' : 'auth-login'}`}
        >
          <div className="auth-desktop-scroll">
            <div className="auth-tabs">
              <DialogTitle>
                <span className={register ? '' : 'text-text-accent'}>
                  {register ? switchControl('Entrar') : 'Entrar'}
                </span>
                <span aria-hidden="true" className="auth-tab-divider" />
                <span className={register ? 'text-text-accent' : ''}>
                  {register ? 'Criar conta' : switchControl('Criar conta')}
                </span>
              </DialogTitle>
            </div>
            <DialogDescription className="auth-description">
              {register
                ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
                : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
            </DialogDescription>
            {form}
          </div>
          <button
            type="button"
            aria-label="Fechar formulário"
            onClick={onClose}
            className="auth-close"
          >
            <Icon asset={figmaAssets.loginDesktop.x} />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
