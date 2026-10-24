import { delay, http, HttpResponse } from 'msw';
import { requireUser } from '@/core/mocks/accounts';
import { transaction } from '@/core/mocks/database';
import { mockResolver } from '@/core/mocks/http';
import { advanceOrders, createOrder } from '@/core/mocks/orders';
import { scenario } from '@/core/mocks/scenarios';

export const orderHandlers = [
  http.post('*/api/orders', mockResolver(async ({ request }) => {
    const owner = requireUser();
    const input = await request.json();
    const active = scenario();
    const result = transaction((db, events) => createOrder(db, events, owner, input, request.headers.get('Idempotency-Key'), active));
    if (result.created) setTimeout(() => advanceOrders(), 2050);
    if (result.created && active === 'timeout-after-create') await delay(10_500);
    return HttpResponse.json(result.order, { status: result.created ? 201 : 200 });
  }, 'mutation')),
];
