import type { OrderReceiptPresentation } from '../../entities/order-receipt-presentation.entity';

export function ReceiptMetadata({
  receipt,
}: {
  receipt: OrderReceiptPresentation;
}) {
  return (
    <dl className="receipt-metadata">
      {[
        ['ID da transação', receipt.transactionId],
        ['Data', receipt.date],
        ['Total', `${receipt.totals.total} ETH`],
        ['Carteira', receipt.wallet],
      ].map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
