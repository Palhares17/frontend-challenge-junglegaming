import type { ReactNode } from 'react';
import type {
  OrderLineItem,
  OrderTotals as Totals,
} from '@/core/entities/order-presentation.entity';
import { MarketplaceShell } from '@/core/components/general/marketplace-shell';
import { MobilePageHeader } from '@/core/components/general/mobile-page-header';
import { OrderItems } from '@/core/components/general/order-items';
import { OrderTotals } from '@/core/components/general/order-totals';
import { EthPrice } from '@/core/components/general/eth-price';
import { Button } from '@/core/components/ui/button';
import type {
  SavedWalletPresentation,
  WalletProvider,
} from '../entities/wallet-presentation.entity';
import { CollectorCheckoutForm } from './components/collector-checkout-form';
import { SavedWalletSelector } from './components/saved-wallet-selector';
import { WalletProviderSelector } from './components/wallet-provider-selector';
import '@/core/components/form/visual-form.css';
import './checkout.css';

interface CheckoutPageProps {
  children?: ReactNode;
  items: readonly OrderLineItem[];
  totals: Totals;
  wallets: readonly SavedWalletPresentation[];
  wallet: string;
  provider: WalletProvider;
  onWalletChange: (value: string) => void;
  onProviderChange: (value: WalletProvider) => void;
  onAction: (label: string) => void;
}

export function CheckoutPage({
  items,
  children,
  totals,
  wallets,
  wallet,
  provider,
  onWalletChange,
  onProviderChange,
  onAction,
}: CheckoutPageProps) {
  return (
    <MarketplaceShell
      breadcrumbs={['Início', 'Mercado', 'Pagamento']}
      onAction={onAction}
      className="checkout-shell"
    >
      <MobilePageHeader
        title="Pagamento com carteira"
        onBack={() => onAction('Voltar')}
      />
      {children ?? <div className="checkout-body">
        <div className="hidden lg:block">
          <CollectorCheckoutForm />
        </div>
        <div className="checkout-review">
          <div className="hidden lg:block">
            <h2 className="mb-3 text-base leading-4 font-bold">Seus NFTs</h2>
            <OrderItems items={items} />
            <button
              type="button"
              className="my-3 w-full text-center text-sm"
              onClick={() => onAction('Aplicar código promocional')}
            >
              Tem um código promocional? Aplique aqui
            </button>
            <OrderTotals totals={totals} />
          </div>
          <SavedWalletSelector
            wallets={wallets}
            value={wallet}
            onChange={onWalletChange}
            onAction={onAction}
          />
          <WalletProviderSelector
            value={provider}
            onChange={onProviderChange}
          />
          <p className="mt-4 flex justify-end gap-7 text-base font-bold lg:hidden">
            Total: <EthPrice value={totals.total} className="text-lg" />
          </p>
          <Button
            onClick={() => onAction('Confirmar compra')}
            className="checkout-confirm-action"
          >
            Confirmar compra
          </Button>
        </div>
      </div>}
    </MarketplaceShell>
  );
}
