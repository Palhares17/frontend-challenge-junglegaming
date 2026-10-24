import { ws } from 'msw';
import { toSocketIo } from '@mswjs/socket.io-binding';
import { mockSession } from './accounts';
import { subscribeMockEvents } from './events';
import { advanceOrders } from './orders';

// MSW 3 removes the /socket.io/ prefix before matching the logical URL.
const link = ws.link(/wss?:\/\/[^/]+\/kurio\/?$/);
const disconnectors = new Set<() => void>();
export function disconnectMockSockets() { for (const close of disconnectors) close(); }
export const realtimeHandlers = [link.addEventListener('connection', (connection) => {
  const { client, rawClient } = toSocketIo(connection);
  const session = mockSession();
  const token = rawClient.url.searchParams.get('sessionId') ?? undefined;
  let closed = false;
  let ticks = 0;
  const valid = () => {
    if (closed) return false;
    const current = mockSession();
    if (current?.id !== session?.id || current?.userId !== session?.userId || token !== session?.id) {
      client.emit('session.expired');
      rawClient.send('41');
      close();
      return false;
    }
    return true;
  };
  const unsubscribe = subscribeMockEvents((event) => {
    if (valid() && (!event.ownerId || event.ownerId === session?.userId)) client.emit(event.name, event.payload);
  });
  const timer = setInterval(() => {
    if (!valid()) return;
    advanceOrders();
    // The published binding establishes the handshake; send Engine.IO heartbeat.
    if (++ticks % 80 === 0) rawClient.send('2');
  }, 250);
  function close() {
    if (closed) return;
    closed = true;
    clearInterval(timer);
    unsubscribe();
    disconnectors.delete(close);
    rawClient.close(1000, 'Simulated session/connection ended');
  }
  disconnectors.add(close);
  rawClient.addEventListener('close', close);
  client.on('session.check', valid);
})];
