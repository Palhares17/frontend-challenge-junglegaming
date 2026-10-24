import { http, HttpResponse } from 'msw';
import { mockSession, mockUser, register, signIn } from './accounts';
import { removeLocal, sessionKey, transaction } from './database';
import { mockResolver } from './http';

export { mockUser } from './accounts';
export const sessionHandlers = [
  http.get('*/api/session', mockResolver(() => HttpResponse.json({ user: mockUser(), sessionId: mockSession()?.id }))),
  http.post('*/api/session', mockResolver(async ({ request }) => HttpResponse.json(await signIn(await request.json())), 'mutation')),
  http.delete('*/api/session', mockResolver(() => {
    const owner = mockSession()?.userId;
    if (owner) transaction((db) => { db.connections[owner] = null; });
    removeLocal(sessionKey);
    return new HttpResponse(null, { status: 204 });
  }, 'mutation')),
  http.post('*/api/accounts', mockResolver(async ({ request }) => HttpResponse.json(await register(await request.json()), { status: 201 }), 'mutation')),
];
