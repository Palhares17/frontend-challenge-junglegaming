import { describe, expect, it } from 'vitest';
import { centsToEth, ethToWei } from './eth';

describe('ETH amounts', () => {
  it('preserves all 18 decimal places and integers above float precision', () => {
    expect(ethToWei('9007199254740993.000000000000000001')).toBe(
      9007199254740993000000000000000001n,
    );
    expect(ethToWei('0.1') + ethToWei('0.2')).toBe(ethToWei('0.3'));
  });

  it.each(['-1', 'NaN', '1e3', '0.0000000000000000001', '', '1.'])(
    'rejects an invalid transport amount: %s',
    (value) => {
      expect(() => ethToWei(value)).toThrow('Invalid ETH amount');
    },
  );

  it('serializes the integer slider bounds without fractional arithmetic', () => {
    expect(centsToEth(2)).toBe('0.02');
    expect(centsToEth(1230)).toBe('12.30');
  });
});
