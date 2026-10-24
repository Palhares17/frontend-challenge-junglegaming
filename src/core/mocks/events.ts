import type { MarketplaceEvent } from '@/core/entities/marketplace.entity';

export interface MockEvent {
  name: 'nft.updated' | 'order.updated';
  payload: MarketplaceEvent;
  ownerId?: string;
}
const history = new Map<string, MockEvent>();
export function clearMockEvents() { history.clear(); }
export function getMockEvent(name: string, id: string) { return history.get(`${name}:${id}`); }
const listeners = new Set<(event: MockEvent) => void>();
export function subscribeMockEvents(listener: (event: MockEvent) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function publishMockEvent(event: MockEvent) {
  const key = `${event.name}:${event.payload.resourceId}`;
  if ((history.get(key)?.payload.version ?? -1) < event.payload.version) history.set(key, structuredClone(event));
  for (const listener of listeners) listener(structuredClone(event));
}
