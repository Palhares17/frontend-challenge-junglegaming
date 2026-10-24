import { http, HttpResponse } from 'msw';
import { getNft } from './cart';
import { readDatabase, removeLocal, resetDatabase, sessionKey, transaction } from './database';
import { clearMockEvents, getMockEvent, publishMockEvent } from './events';
import { invalid, missing, objectInput, text } from './errors';
import { mockResolver } from './http';
import { nftEvent, settleOrder } from './orders';
import { disconnectMockSockets } from './realtime';
import { scenario, scenarioKey, scenarios, setScenario } from './scenarios';
import { ethToWei } from '@/core/lib/eth';

function ethInput(value: unknown, field: string) {
  if (typeof value !== 'string' || !/^\d+(\.\d{1,18})?$/.test(value) || value.length > 60) invalid({ [field]: 'ETH deve ser uma string decimal com até 18 casas.' });
  ethToWei(value);
  return value;
}
export const controlHandlers = [
  http.post('*/api/mock/reset', mockResolver(async ({ request }) => {
    const input = objectInput(await request.json());
    if (input.preset !== undefined && input.preset !== 'default' && input.preset !== 'populated') invalid({ preset: 'Use default ou populated.' });
    disconnectMockSockets();
    clearMockEvents();
    resetDatabase(input.preset);
    for (const key of [sessionKey, scenarioKey, 'kurio:mock-scenario', 'kurio:navigation-scenario']) removeLocal(key);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('kurio:catalog-search');
      for (const key of Object.keys(sessionStorage)) if (key.startsWith('kurio:purchase:')) sessionStorage.removeItem(key);
    }
    return HttpResponse.json({ preset: input.preset ?? 'default' });
  }, 'control')),
  http.get('*/api/mock/scenario', mockResolver(() => HttpResponse.json({ scenario: scenario(), available: scenarios }), 'control')),
  http.put('*/api/mock/scenario', mockResolver(async ({ request }) => HttpResponse.json({ scenario: setScenario(objectInput(await request.json()).scenario) }), 'control')),
  http.patch('*/api/mock/nfts/:id', mockResolver(async ({ request, params }) => {
    const input = objectInput(await request.json());
    return HttpResponse.json(transaction((db, events) => {
      const nft = getNft(db, String(params.id));
      if (input.price !== undefined) nft.price = ethInput(input.price, 'price');
      if (input.editions !== undefined) {
        if (!Array.isArray(input.editions)) invalid({ editions: 'Informe uma lista de edições.' });
        for (const value of input.editions) {
          const entry = objectInput(value);
          const edition = nft.editions.find((item) => item.id === entry.id);
          if (!edition || typeof entry.available !== 'number' || !Number.isSafeInteger(entry.available) || entry.available < 0 || entry.available > 100) invalid({ editions: 'Edição ou estoque inválido (0–100).' });
          edition.available = entry.available;
        }
      }
      nft.version++;
      events.push(nftEvent(db, nft));
      return nft;
    }));
  }, 'control')),
  http.patch('*/api/mock/fees', mockResolver(async ({ request }) => {
    const value = ethInput(objectInput(await request.json()).networkFee, 'networkFee');
    transaction((db) => { db.fee = value; });
    return HttpResponse.json({ networkFee: value });
  }, 'control')),
  http.patch('*/api/mock/coupons/:code', mockResolver(async ({ request, params }) => {
    const input = objectInput(await request.json());
    if (typeof input.expired !== 'boolean') invalid({ expired: 'Informe true ou false.' });
    return HttpResponse.json(transaction((db) => {
      const coupon = db.coupons[String(params.code).toUpperCase()] ?? missing();
      coupon.expired = input.expired as boolean;
      return coupon;
    }));
  }, 'control')),
  http.post('*/api/mock/orders/:id/settle', mockResolver(async ({ request, params }) => {
    const status = objectInput(await request.json()).status;
    if (status !== 'confirmed' && status !== 'declined') invalid({ status: 'Use confirmed ou declined.' });
    return HttpResponse.json(transaction((db, events) => settleOrder(db, events, String(params.id), status)));
  }, 'control')),
  http.post('*/api/mock/events/replay', mockResolver(async ({ request }) => {
    const input = objectInput(await request.json());
    const event = getMockEvent(text(input.name, 'name'), text(input.resourceId, 'resourceId'));
    if (!event) return missing();
    if (input.mode !== 'duplicate' && input.mode !== 'old') invalid({ mode: 'Use duplicate ou old.' });
    const replay = structuredClone(event);
    if (input.mode === 'old') {
      replay.payload.eventId += '-old';
      replay.payload.version = Math.max(0, replay.payload.version - 1);
      if ('version' in replay.payload.data) replay.payload.data.version = replay.payload.version;
    }
    publishMockEvent(replay);
    return HttpResponse.json(replay.payload);
  }, 'control')),
  http.post('*/api/mock/connection/disconnect', mockResolver(() => {
    disconnectMockSockets();
    return new HttpResponse(null, { status: 204 });
  }, 'control')),
  http.get('*/api/mock/inventory', mockResolver(() => HttpResponse.json({ items: readDatabase().nfts }), 'control')),
];
