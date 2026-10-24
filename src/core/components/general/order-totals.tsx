import type { OrderTotals as Totals } from '@/core/entities/order-presentation.entity';

export function OrderTotals({
  totals,
  compact = false,
}: {
  totals: Totals;
  compact?: boolean;
}) {
  return (
    <dl className="order-totals">
      {!compact && (
        <>
          <div>
            <dt>Subtotal</dt>
            <dd>{totals.subtotal} ETH</dd>
          </div>
          <div>
            <dt>Desconto do lançamento</dt>
            <dd>(-) {totals.discount}</dd>
          </div>
        </>
      )}
      <div className="network-fee">
        <dt>Taxa de rede</dt>
        <dd>
          {totals.networkFee} ETH
          {!compact && <span className="network-fee-note">Taxa estimada</span>}
        </dd>
      </div>
      <div className="order-total">
        <dt>Total</dt>
        <dd>{totals.total} ETH</dd>
      </div>
    </dl>
  );
}
