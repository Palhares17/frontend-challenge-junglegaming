import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { Breadcrumbs } from './breadcrumbs';
import './page-shell.css';

interface MarketplaceShellProps {
  children: ReactNode;
  breadcrumbs?: readonly string[];
  onAction: (label: string) => void;
  footer?: boolean;
  className?: string;
}

export function MarketplaceShell({
  children,
  breadcrumbs,
  onAction,
  footer = true,
  className = '',
}: MarketplaceShellProps) {
  return (
    <div className={`marketplace-shell ${className}`}>
      <SiteHeader
        query=""
        active="market"
        divider={false}
        onNavigate={onAction}
        onSearch={() => onAction('Busca')}
      />
      <main className="marketplace-main">
        {breadcrumbs && (
          <Breadcrumbs items={breadcrumbs} onNavigate={onAction} />
        )}
        {children}
      </main>
      {footer && (
        <div className="marketplace-footer">
          <SiteFooter onCollection={() => onAction('Coleções')} />
        </div>
      )}
    </div>
  );
}
