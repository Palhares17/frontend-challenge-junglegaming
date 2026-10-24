import type { FormEventHandler } from 'react';
import type { Nft } from '@/core/entities/nft.entity';
import type {
  OrderLineItem,
  OrderTotals,
} from '@/core/entities/order-presentation.entity';
import { MarketplaceShell } from '@/core/components/general/marketplace-shell';
import { MobilePageHeader } from '@/core/components/general/mobile-page-header';
import { NftCollectionStrip } from '@/core/components/general/nft-collection-strip';
import { CartItem } from './components/cart-item';
import { CartSummary } from './components/cart-summary';
import '@/core/components/general/order-summary.css';
import './cart.css';

interface CartPageProps {
  items: readonly OrderLineItem[];
  highlightedRemovalId?: string;
  coupon?: string | null;
  couponError?: string | null;
  onRemoveCoupon?: () => void;
  totals: OrderTotals;
  related: readonly Nft[];
  onAction: (label: string) => void;
  onQuantityChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  onCoupon: FormEventHandler<HTMLFormElement>;
}

export function CartPage({
  items,
  coupon, couponError, onRemoveCoupon,
  highlightedRemovalId,
  totals,
  related,
  onAction,
  onQuantityChange,
  onRemove,
  onCoupon,
}: CartPageProps) {
  return (
    <MarketplaceShell
      breadcrumbs={['Início', 'Mercado', 'Carrinho']}
      onAction={onAction}
      className="cart-shell"
    >
      <MobilePageHeader
        title="Carrinho de NFTs"
        onBack={() => onAction('Voltar')}
      />
      <h1 className="sr-only hidden lg:block">Carrinho de NFTs</h1>
      <div className="cart-body">
        <section aria-label="Itens do carrinho" className="min-w-0">
          <div className="cart-table-header" aria-hidden="true">
            <span>NFTs</span>
            <span>Preço</span>
            <span>Edições</span>
            <span>Total</span>
            <span />
          </div>
          <ul className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                highlightRemoval={item.id === highlightedRemovalId}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </ul>
          {items.length === 0 && (
            <p className="rounded-3xl bg-card p-8 text-text-secondary">
              Seu carrinho está vazio.
            </p>
          )}
        </section>
        <CartSummary
          totals={totals}
          coupon={coupon}
          couponError={couponError}
          onRemoveCoupon={onRemoveCoupon}
          empty={!items.length}
          onCoupon={onCoupon}
          onCheckout={() => onAction('Conectar e finalizar')}
          onContinue={() => onAction('Continuar explorando')}
        />
      </div>
      <div className="hidden lg:block">
        <NftCollectionStrip
          title="Colecionadores também viram"
          items={related}
          onAction={onAction}
        />
      </div>
    </MarketplaceShell>
  );
}
