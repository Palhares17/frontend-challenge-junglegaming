import { describe, expect, it } from 'vitest';
import { safeRedirect } from './redirect';

describe('safe product return destinations', () => {
  it.each([
    '/checkout?network=ethereum#review',
    '/nfts/nft-1',
    '/account/wallets',
    '/orders/demo-confirmed/confirmation',
    '/?q=Emerald&page=2',
  ])('preserves internal destination %s', (destination) => {
    expect(safeRedirect(destination)).toBe(destination);
  });
  it.each([
    undefined,
    42,
    '',
    'https://evil.test',
    '//evil.test',
    '/\\evil.test',
    '/cart\n',
    '/login?redirect=/login',
    '/register',
    '/ui-preview.html',
    '/orders/demo%2fconfirmation',
    '/account/%77allets',
    '/unknown',
  ])('rejects invalid destination %s', (destination) => {
    expect(safeRedirect(destination)).toBe('/');
  });
});
