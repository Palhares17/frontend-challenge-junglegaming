import { Link } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { AccountSidebar, type AccountSection } from './account-sidebar';
import { MobilePageHeader } from './mobile-page-header';
import './page-shell.css';
import '@/core/components/form/visual-form.css';

export function AccountShell({
  title,
  active,
  onAction,
  children,
  className = '',
}: {
  title: string;
  active: AccountSection;
  onAction: (label: string) => void;
  children: ReactNode;
  className?: string;
}) {
  const navigation = useProductNavigation();
  return (
    <div className={`account-shell ${className}`}>
      <SiteHeader
        active={null}
        query=""
        onSearch={() => onAction('Busca')}
        onNavigate={onAction}
      />
      <MobilePageHeader title={title} onBack={() => onAction('Voltar')} />
      {navigation && (
        <nav
          aria-label="Minha conta mobile"
          className="flex flex-wrap gap-5 text-sm text-text-accent lg:hidden"
        >
          <Link
            to="/account/profile"
            preload={false}
            aria-current={active === 'profile' ? 'page' : undefined}
          >
            Dados do perfil
          </Link>
          <Link
            to="/account/wallets"
            preload={false}
            aria-current={active === 'wallets' ? 'page' : undefined}
          >
            Carteiras
          </Link>
          <button type="button" onClick={() => onAction('Sair')}>
            Sair
          </button>
        </nav>
      )}
      <div className="account-body">
        <div className="hidden lg:block">
          <AccountSidebar active={active} onAction={onAction} />
        </div>
        <main className="visual-form min-w-0">{children}</main>
      </div>
    </div>
  );
}
