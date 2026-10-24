import type { CreateOrderInput, InventoryNft } from '@/core/entities/marketplace.entity';
import { cartData, getCart, getNft, quoteFingerprint, validateStock } from './cart';
import { nextId, readDatabase, transaction, type Database, type StoredOrder } from './database';
import { emailInput, invalid, missing, MockError, objectInput, text } from './errors';
import type { MockEvent } from './events';
import { networkInput } from './accounts';

export function nftEvent(db: Database, nft: InventoryNft): MockEvent {
  return { name: 'nft.updated', payload: { eventId: nextId(db, 'event'), resourceId: nft.id, version: nft.version, data: structuredClone(nft) } };
}
export function orderEvent(db: Database, order: StoredOrder): MockEvent {
  return { name: 'order.updated', ownerId: order.ownerId, payload: { eventId: nextId(db, 'event'), resourceId: order.response.id, version: order.version, data: { id: order.response.id, status: order.response.status } } };
}
export function orderInput(value: unknown): CreateOrderInput {
  const input = objectInput(value);
  const collector = objectInput(input.collector);
  if (collector.notes !== undefined && (typeof collector.notes !== 'string' || collector.notes.length > 1000)) invalid({ notes: 'Use até 1000 caracteres.' });
  return { quoteId: text(input.quoteId, 'quoteId'), walletId: text(input.walletId, 'walletId'), network: networkInput(input.network), collector: { displayName: text(collector.displayName, 'displayName'), email: emailInput(collector.email), ...(collector.notes !== undefined ? { notes: collector.notes as string } : {}) } };
}
export function createOrder(db: Database, events: MockEvent[], ownerId: string, value: unknown, key: string | null, scenario: string, now = Date.now()) {
  if (!key || !/^[A-Za-z0-9_-]{8,128}$/.test(key)) invalid({ idempotencyKey: 'Envie Idempotency-Key com 8 a 128 caracteres alfanuméricos, - ou _.' });
  const input = orderInput(value);
  const fingerprint = JSON.stringify(input);
  const attemptKey = `${ownerId}:${key}`;
  const attempt = db.attempts[attemptKey];
  if (attempt) {
    if (attempt.fingerprint !== fingerprint) throw new MockError(409, 'IDEMPOTENCY_CONFLICT', 'Chave já utilizada com outro conteúdo.');
    return { created: false, order: db.orders[attempt.orderId].response };
  }
  const quote = db.quotes[input.quoteId];
  if (!quote || quote.ownerId !== ownerId) missing();
  if (quote.expiresAt <= now || quote.fingerprint !== quoteFingerprint(db, ownerId)) throw new MockError(409, 'QUOTE_CHANGED', 'A cotação mudou ou expirou. Revise os valores e confirme novamente.');
  validateStock(db, getCart(db, ownerId).items);
  const wallet = db.wallets[ownerId]?.find((item) => item.id === input.walletId) ?? missing();
  if (wallet.network !== input.network || quote.items.some((item) => getNft(db, item.nftId).network !== input.network)) throw new MockError(409, 'NETWORK_MISMATCH', 'NFTs e carteira devem usar a mesma rede.');
  const connection = db.connections[ownerId];
  if (connection?.status !== 'connected' || connection.walletId !== wallet.id || connection.network !== input.network) throw new MockError(409, 'WALLET_DISCONNECTED', 'Conecte a carteira antes de confirmar.');
  const id = nextId(db, 'order');
  const order: StoredOrder = {
    ownerId, response: { id, status: 'pending' }, version: 1,
    outcome: scenario === 'payment-declined' ? 'declined' : 'confirmed',
    settleAt: scenario === 'order-pending' ? null : now + 2000,
    purchase: input, quote: structuredClone(quote), snapshot: {
      status: 'confirmed', transactionId: `0xkurio-simulated-${id}`, date: new Date(now).toISOString(), wallet: `${wallet.label} · ${wallet.network}`, items: structuredClone(quote.items), totals: { ...quote.totals }, note: 'Compra e transação simuladas, sem blockchain ou pagamento real.',
    },
  };
  // Reserve inventory before returning; no cart is consumed until confirmation.
  for (const item of quote.items) {
    const nft = getNft(db, item.nftId);
    nft.editions.find((edition) => edition.id === item.editionId)!.available -= item.quantity;
    nft.version++;
    events.push(nftEvent(db, nft));
  }
  db.orders[id] = order;
  db.attempts[attemptKey] = { fingerprint, orderId: id };
  events.push(orderEvent(db, order));
  return { created: true, order: order.response };
}
export function settleOrder(db: Database, events: MockEvent[], id: string, outcome?: 'confirmed' | 'declined') {
  const order = db.orders[id] ?? missing();
  if (order.response.status !== 'pending') return order.response;
  // Historical records have no reservation and only model read-only states.
  if (!order.quote) throw new MockError(409, 'HISTORICAL_ORDER', 'Pedido histórico não pode ser alterado.');
  order.outcome = outcome ?? order.outcome;
  if (order.outcome === 'confirmed') {
    const cart = getCart(db, order.ownerId);
    for (const purchased of order.quote.items) {
      const line = cart.items.find((item) => item.id === purchased.id);
      if (line) line.quantity = Math.max(0, line.quantity - purchased.quantity);
    }
    cart.items = cart.items.filter((item) => item.quantity > 0);
    cart.version++;
    if (!cart.items.length) cart.coupon = null;
    order.response = { id, status: 'confirmed', receipt: structuredClone(order.snapshot) };
  } else {
    for (const item of order.quote.items) {
      const nft = getNft(db, item.nftId);
      nft.editions.find((edition) => edition.id === item.editionId)!.available += item.quantity;
      nft.version++;
      events.push(nftEvent(db, nft));
    }
    order.response = { id, status: 'declined' };
  }
  order.settleAt = null;
  order.version++;
  events.push(orderEvent(db, order));
  return order.response;
}
export function advanceOrders(now = Date.now()) {
  if (!Object.values(readDatabase().orders).some((order) => order.response.status === 'pending' && order.settleAt !== null && order.settleAt <= now)) return;
  transaction((db, events) => {
    for (const order of Object.values(db.orders)) if (order.response.status === 'pending' && order.settleAt !== null && order.settleAt <= now) settleOrder(db, events, order.response.id);
  });
}
export function checkoutData(db: Database, owner: string) {
  const cart = cartData(db, owner);
  return { ...cart, wallets: db.wallets[owner] ?? [], collector: db.accounts[owner].profile, connection: db.connections[owner] ?? null };
}
