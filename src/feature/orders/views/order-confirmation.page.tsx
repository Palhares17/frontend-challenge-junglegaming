import type { OrderReceiptPresentation } from '../entities/order-receipt-presentation.entity';
import { figmaAssets } from '@/core/lib/figma-assets';
import { Icon } from '@/core/components/general/icon';
import { Button } from '@/core/components/ui/button';
import { OrderItems } from '@/core/components/general/order-items';
import { OrderTotals } from '@/core/components/general/order-totals';
import { ReceiptMetadata } from './components/receipt-metadata';
import './order-confirmation.css';

export function OrderConfirmationPage({
  receipt,
  onClose,
  onExplore,
}: {
  receipt: OrderReceiptPresentation;
  onClose: () => void;
  onExplore: () => void;
}) {
  return (
    <main className="order-confirmation-page">
      <article className="order-receipt" aria-labelledby="receipt-title">
        <button
          type="button"
          aria-label="Fechar recibo"
          onClick={onClose}
          className="receipt-close"
        >
          <Icon asset={figmaAssets.orderDesktop.x} />
        </button>
        <header className="receipt-header">
          <div className="flex size-20 justify-center">
            <Icon asset={figmaAssets.orderDesktop.group} />
          </div>
          <h1 id="receipt-title">Seus NFTs agora estão na sua carteira</h1>
        </header>
        <ReceiptMetadata receipt={receipt} />
        <section className="receipt-details">
          <h2 className="text-[15px] leading-4 font-bold">
            Detalhes da transação
          </h2>
          <OrderItems items={receipt.items} receipt />
          <div className="receipt-totals">
            <OrderTotals totals={receipt.totals} compact />
          </div>
          <div className="receipt-note">
            <p>{receipt.note}</p>
            <Button
              onClick={onExplore}
              className="mt-5 h-12 rounded-[5px] text-base"
            >
              Ver no Etherscan
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
}
