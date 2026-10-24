import type { FormEventHandler, ReactNode } from 'react';
import { AccountShell } from '@/core/components/general/account-shell';
import { CollectorFields } from '@/core/components/form/collector-fields';
import { Button } from '@/core/components/ui/button';
import { SecondaryWalletSection } from './components/secondary-wallet-section';

interface WalletsPageProps {
  children?: ReactNode;
  onAction: (label: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function WalletsPage({ onAction, onSubmit, children }: WalletsPageProps) {
  return (
    <AccountShell
      className="wallets-shell"
      title="Carteiras"
      active="wallets"
      onAction={onAction}
    >
      {children ?? <>
      <form onSubmit={onSubmit}>
        <h1 className="sr-only hidden lg:block">Carteiras</h1>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="account-heading">Carteira principal</h2>
            <p className="mt-2 text-sm leading-[15px] text-text-secondary">
              Estas carteiras ficam disponíveis no pagamento e para receber NFTs
              comprados.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAction('Adicionar carteira')}
            className="text-[15px] text-text-accent"
          >
            Adicionar
          </button>
        </div>
        <div className="mt-8">
          <CollectorFields wallet />
        </div>
        <Button
          type="submit"
          className="mt-8 h-10 rounded-input text-[15px]"
        >
          Salvar carteira
        </Button>
      </form>
      <SecondaryWalletSection
        onAdd={() => onAction('Adicionar carteira secundária')}
      />
      </>}
    </AccountShell>
  );
}
