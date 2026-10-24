import type { FormEventHandler } from 'react';
import type { OrderTotals as Totals } from '@/core/entities/order-presentation.entity';
import { OrderTotals } from '@/core/components/general/order-totals';
import { Button } from '@/core/components/ui/button';
import { CouponForm } from './coupon-form';

export function CartSummary({
  totals,
  coupon, couponError, onRemoveCoupon, empty,
  onCoupon,
  onCheckout,
  onContinue,
}: {
  totals: Totals;
  coupon?: string | null;
  couponError?: string | null;
  onRemoveCoupon?: () => void;
  empty?: boolean;
  onCoupon: FormEventHandler<HTMLFormElement>;
  onCheckout: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="cart-summary" aria-label="Resumo da carteira">
      <h2 className="mb-5 hidden border-b border-border-soft pb-3 text-lg leading-4 font-bold lg:block">
        Resumo da carteira
      </h2>
      <CouponForm onSubmit={onCoupon} />
      {coupon && <p className="mt-3 text-sm" role="status">Cupom {coupon} {couponError ? 'inválido ou expirado' : 'aplicado'}. <button type="button" onClick={onRemoveCoupon} className="text-text-accent underline">Remover cupom</button></p>}
      <div className="mt-5">
        <OrderTotals totals={totals} />
      </div>
      <Button disabled={empty} onClick={onCheckout} className="cart-checkout-button">
        Conectar e finalizar
      </Button>
      <button
        type="button"
        onClick={onContinue}
        className="mt-3 hidden w-full text-center text-[15px] text-text-accent lg:block"
      >
        Continuar explorando
      </button>
    </section>
  );
}
