import { delay, HttpResponse } from 'msw';
import { readLocal, removeLocal, sessionKey, writeLocal } from './database';
import { invalid, MockError } from './errors';

export const scenarioKey = 'kurio:api-scenario';
export const scenarios = ['default', 'empty', 'race', 'slow', 'offline', 'error', 'timeout', 'validation', 'conflict', 'forbidden', 'session-expired', 'payment-declined', 'order-pending', 'timeout-after-create', 'wallet-rejected', 'wallet-disconnected'] as const;
export function scenario() { return readLocal(scenarioKey) ?? 'default'; }
export function setScenario(value: unknown) {
  if (typeof value !== 'string' || !scenarios.includes(value as typeof scenarios[number])) invalid({ scenario: 'Cenário desconhecido.' });
  writeLocal(scenarioKey, value);
  return value;
}
export async function networkCondition(scope: 'catalog' | 'navigation' | 'mutation', request: Request) {
  const active = scenario();
  const legacy = readLocal(scope === 'catalog' ? 'kurio:mock-scenario' : 'kurio:navigation-scenario');
  const query = new URL(request.url).searchParams;
  const wait = legacy === 'race' || active === 'race' ? query.get('q') === 'Emerald' ? 1500 : 100 : active === 'slow' || legacy === 'slow' ? 1800 : scope === 'catalog' ? 250 : 150;
  await delay(wait);
  if (active === 'session-expired') removeLocal(sessionKey);
  if (active === 'offline') return HttpResponse.error();
  if (active === 'timeout') { await delay(10_500); return HttpResponse.error(); }
  if (active === 'error' || legacy === 'error') throw new MockError(503, 'SERVICE_UNAVAILABLE', 'Serviço indisponível.');
  if (active === 'forbidden') throw new MockError(403, 'FORBIDDEN', 'Acesso não permitido neste cenário.');
  if (scope === 'mutation' && active === 'validation') throw new MockError(422, 'VALIDATION_ERROR', 'Validação simulada.', { body: 'Dados rejeitados pelo cenário.' });
  if (scope === 'mutation' && active === 'conflict') throw new MockError(409, 'SIMULATED_CONFLICT', 'Conflito simulado.');
  return null;
}
