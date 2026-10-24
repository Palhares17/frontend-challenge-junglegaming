import { useEffect } from 'react';
import { readAttempt, writeAttempt } from '@/feature/checkout/services/purchase.service';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link, useRouterState } from '@tanstack/react-router';
import { useProductNavigation } from '@/core/router/navigation';
import { useUnavailable } from '@/core/hooks/use-unavailable';
import { orderOptions } from '../services/get-order.service';
import { OrderConfirmationPage } from './order-confirmation.page';
const route = getRouteApi('/_authenticated/orders/$orderId');
export function OrderRoutePage() {
  const { orderId } = route.useParams();
  const { user } = route.useRouteContext();
  const { data } = useSuspenseQuery(orderOptions(user.id, orderId));
  useEffect(() => {
    const attempt = readAttempt(user.id);
    if (data.status !== 'pending' && attempt?.orderId === orderId) writeAttempt(user.id, null);
  }, [data.status, user.id, orderId]);
  const navigation = useProductNavigation()!;
  const notify = useUnavailable();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  if (data.status === 'confirmed' && pathname.endsWith('/confirmation')) {
    return (
      <OrderConfirmationPage
        receipt={data.receipt}
        onClose={() => navigation.onAction('Início')}
        onExplore={() => notify('Explorador de transação simulada')}
      />
    );
  }
  return (
    <main className="mx-auto max-w-content space-y-6 p-7">
      <h1 className="text-2xl font-bold">
        {data.status === 'pending'
          ? 'Pedido pendente'
          : data.status === 'declined'
            ? 'Pagamento recusado'
            : 'Pedido confirmado'}
      </h1>
      <p role="status">
        Pedido {data.id}.{' '}
        {data.status === 'pending'
          ? 'A confirmação ainda não está disponível.'
          : data.status === 'declined'
            ? 'Nenhuma compra foi confirmada.'
            : 'Compra confirmada na simulação.'}
      </p>
      {data.status === 'confirmed' && (
        <Link
          to="/orders/$orderId/confirmation"
          preload={false}
          params={{ orderId }}
          className="mr-6 text-text-accent underline"
        >
          Ver recibo
        </Link>
      )}
      <Link to="/cart" className="mr-6 text-text-accent underline">
        Voltar ao carrinho
      </Link>
      <Link
        to="/"
        search={navigation.catalogSearch}
        className="text-text-accent underline"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
