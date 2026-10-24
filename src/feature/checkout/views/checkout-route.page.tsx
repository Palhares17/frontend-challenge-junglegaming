import { useRef, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link, useRouter } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { Network, Quote } from '@/core/entities/marketplace.entity';
import { useProductNavigation } from '@/core/router/navigation';
import { sessionOptions } from '@/core/session/session';
import { ApiFeedback } from '@/core/components/form/api-feedback';
import { LabeledInput } from '@/core/components/form/labeled-input';
import { Button } from '@/core/components/ui/button';
import { OrderItems } from '@/core/components/general/order-items';
import { OrderTotals } from '@/core/components/general/order-totals';
import { orderOptions } from '@/feature/orders/services/get-order.service';
import { checkoutOptions } from '../services/get-checkout.service';
import {
  connectWallet,
  disconnectWallet,
  readAttempt,
  requestQuote,
  submitPurchase,
  writeAttempt,
  type PurchaseAttempt,
} from '../services/purchase.service';
import { CheckoutPage } from './checkout.page';
const route = getRouteApi('/_authenticated/checkout');
export function CheckoutRoutePage() {
  const { user } = route.useRouteContext();
  const { data } = useSuspenseQuery(checkoutOptions(user.id));
  const router = useRouter();
  const client = router.options.context.queryClient;
  const navigation = useProductNavigation()!;
  const [walletId, setWalletId] = useState(
    data.wallets.find((item) => item.primary)?.id ?? '',
  );
  const wallet = data.wallets.find((item) => item.id === walletId);
  const [network, setNetwork] = useState<Network>(
    wallet?.network ?? 'ethereum',
  );
  const [quote, setQuote] = useState<Quote | null>(null);
  const [collector, setCollector] = useState({
    displayName: data.collector.displayName,
    email: data.collector.email,
    notes: '',
  });
  const [attempt, setAttempt] = useState(() => readAttempt(user.id));
  const [storageError, setStorageError] = useState<unknown>(null);
  const busy = useRef(false);
  const sessionId = client.getQueryData(sessionOptions.queryKey)?.sessionId;
  const current = () =>
    client.getQueryData(sessionOptions.queryKey)?.sessionId === sessionId;
  const stale =
    !!quote &&
    (JSON.stringify(quote.items) !== JSON.stringify(data.items) ||
      JSON.stringify(quote.totals) !== JSON.stringify(data.totals) ||
      quote.coupon !== data.coupon);
  const connected =
    data.connection?.walletId === walletId &&
    data.connection.network === network &&
    data.connection.status === 'connected';
  const connection = useMutation({
    mutationFn: async (disconnect: boolean) => {
      if (disconnect) await disconnectWallet();
      else await connectWallet(walletId, network);
    },
    onSuccess: () =>
      client.invalidateQueries({ queryKey: checkoutOptions(user.id).queryKey }),
  });
  const quotation = useMutation({
    mutationFn: requestQuote,
    onSuccess: (result) => {
      if (current()) setQuote(result);
    },
  });
  const purchase = useMutation({
    mutationFn: submitPurchase,
    retry: false,
    onSuccess: async (order, sent) => {
      if (!current()) return;
      const saved = { ...sent, orderId: order.id };
      writeAttempt(user.id, saved);
      setAttempt(saved);
      client.setQueryData(orderOptions(user.id, order.id).queryKey, order);
      await router.navigate({
        to: '/orders/$orderId',
        params: { orderId: order.id },
      });
    },
    onError: (error) => {
      if (!current()) return;
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500 &&
        error.response.status !== 401
      ) {
        writeAttempt(user.id, null);
        setAttempt(null);
        setQuote(null);
        void client.invalidateQueries({
          queryKey: checkoutOptions(user.id).queryKey,
        });
        toast.error(
          'A compra não foi criada. Confira os dados e revise a cotação novamente.',
        );
      }
    },
    onSettled: () => {
      busy.current = false;
    },
  });
  function submit(sent: PurchaseAttempt) {
    if (busy.current) return;
    try {
      writeAttempt(user.id, sent);
      setAttempt(sent);
      setStorageError(null);
      busy.current = true;
      purchase.mutate(sent);
    } catch (error) {
      busy.current = false;
      setStorageError(error);
    }
  }
  const pending =
    connection.isPending || quotation.isPending || purchase.isPending;
  return (
    <CheckoutPage
      {...data}
      wallet={walletId}
      provider="walletconnect"
      onWalletChange={setWalletId}
      onProviderChange={() => {}}
      onAction={navigation.onAction}
    >
      <form
        className="checkout-body"
        onSubmit={(event) => {
          event.preventDefault();
          if (
            pending ||
            busy.current ||
            attempt ||
            !connected ||
            !data.items.length
          )
            return;
          if (!quote || stale) {
            quotation.mutate();
            return;
          }
          submit({
            key: crypto.randomUUID(),
            input: { quoteId: quote.id, walletId, network, collector },
          });
        }}
      >
        <section className="visual-form min-w-0">
          <h1 className="mb-6 text-lg font-bold">Perfil do colecionador</h1>
          <fieldset disabled={pending || !!attempt} className="space-y-5">
            <LabeledInput
              label="Nome de exibição"
              name="displayName"
              value={collector.displayName}
              onChange={(event) => {
                setCollector({ ...collector, displayName: event.target.value });
                setQuote(null);
              }}
              required
              maxLength={80}
            />
            <LabeledInput
              label="E-mail"
              name="email"
              type="email"
              value={collector.email}
              onChange={(event) => {
                setCollector({ ...collector, email: event.target.value });
                setQuote(null);
              }}
              required
            />
            <LabeledInput
              label="Observação do colecionador (opcional)"
              name="notes"
              value={collector.notes}
              onChange={(event) => {
                setCollector({ ...collector, notes: event.target.value });
                setQuote(null);
              }}
              maxLength={1000}
            />
            <h2 className="pt-4 text-base font-bold">Carteira e rede</h2>
            {!data.wallets.length ? (
              <p>
                Você ainda não adicionou uma carteira.{' '}
                <Link
                  to="/account/wallets"
                  className="text-text-accent underline"
                >
                  Adicionar carteira
                </Link>
              </p>
            ) : (
              <>
                <label className="form-field">
                  <span className="form-label">Carteira salva</span>
                  <select
                    name="walletId"
                    aria-label="Carteira salva"
                    value={walletId}
                    onChange={(event) => {
                      const selected = data.wallets.find(
                        (item) => item.id === event.target.value,
                      );
                      setWalletId(event.target.value);
                      setNetwork(selected?.network ?? 'ethereum');
                      setQuote(null);
                    }}
                    className="visual-input w-full"
                    required
                  >
                    <option value="" disabled>
                      Selecione uma carteira
                    </option>
                    {data.wallets.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label} · {item.network}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-xs break-all text-text-secondary">
                  {wallet?.address}
                </p>
                <label className="form-field">
                  <span className="form-label">Rede</span>
                  <select
                    aria-label="Rede"
                    name="network"
                    value={network}
                    onChange={(event) => {
                      setNetwork(event.target.value as Network);
                      setQuote(null);
                    }}
                    className="visual-input w-full"
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                  </select>
                </label>
                <p role="status" className="text-sm">
                  {connected
                    ? 'Carteira conectada na simulação.'
                    : 'Nenhuma carteira está conectada.'}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => connection.mutate(connected)}
                  >
                    {connected ? 'Desconectar carteira' : 'Conectar carteira'}
                  </Button>
                  <Link
                    to="/account/wallets"
                    className="text-sm text-text-accent underline"
                  >
                    Gerenciar carteiras
                  </Link>
                </div>
              </>
            )}
          </fieldset>
          <ApiFeedback error={connection.error} />
        </section>
        <section
          className="checkout-review min-w-0 space-y-5"
          aria-label="Revisão da compra"
        >
          <h2 className="text-lg font-bold">Seus NFTs</h2>
          {!data.items.length && !attempt ? (
            <p role="status">
              Seu carrinho está vazio.{' '}
              <Link
                to="/"
                search={navigation.catalogSearch}
                className="text-text-accent underline"
              >
                Explorar NFTs
              </Link>
            </p>
          ) : (
            <OrderItems items={quote?.items ?? data.items} />
          )}
          <OrderTotals totals={quote?.totals ?? data.totals} />
          <Link to="/cart" className="block text-sm text-text-accent underline">
            Editar carrinho ou cupom
          </Link>
          {quote && (
            <p role="status" className="text-sm">
              {stale
                ? 'Preço ou disponibilidade alterados. Revise a nova cotação antes de confirmar.'
                : 'Revise os itens, a carteira e o total. A compra e a transação são simuladas.'}
            </p>
          )}
          <ApiFeedback
            error={quotation.error ?? purchase.error ?? storageError}
          />
          {attempt ? (
            <div className="space-y-4">
              <p role="status">
                {attempt.orderId
                  ? 'Você já enviou este pedido.'
                  : 'Sua tentativa foi preservada. Recupere o resultado antes de tentar outra compra.'}
              </p>
              {attempt.orderId ? (
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: attempt.orderId }}
                  className="text-text-accent underline"
                >
                  Acompanhar pedido
                </Link>
              ) : (
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => submit(attempt)}
                >
                  Recuperar pedido
                </Button>
              )}
            </div>
          ) : (
            <Button
              type="submit"
              disabled={pending || !connected || !data.items.length}
              className="checkout-confirm-action"
            >
              {pending
                ? 'Processando…'
                : !quote || stale
                  ? 'Revisar compra'
                  : 'Confirmar compra'}
            </Button>
          )}
        </section>
      </form>
    </CheckoutPage>
  );
}
