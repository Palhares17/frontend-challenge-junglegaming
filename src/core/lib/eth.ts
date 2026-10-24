/** Compare ETH amounts without converting their fractional part to floats. */
export function ethToWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Invalid ETH amount');
  }
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'));
}

/** Filter slider values are integer hundredths, not purchase calculations. */
export function centsToEth(value: number): string {
  return `${Math.trunc(value / 100)}.${String(value % 100).padStart(2, '0')}`;
}
