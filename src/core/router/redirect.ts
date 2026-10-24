// Only product routes are valid return destinations. URL parsing also rejects
// backslash normalization, protocol-relative URLs and encoded path delimiters.
export function safeRedirect(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.includes('\\') ||
    Array.from(value).some((char) => char.charCodeAt(0) < 32)
  )
    return '/';
  try {
    const url = new URL(value, 'https://kurio.invalid');
    if (url.origin !== 'https://kurio.invalid') return '/';
    const path = decodeURIComponent(url.pathname);
    if (url.pathname.includes('%') || /[\\%?#]/.test(path)) return '/';
    if (
      !/^\/$|^\/cart\/?$|^\/checkout\/?$|^\/account\/(profile|wallets)\/?$|^\/nfts\/[\w-]+\/?$|^\/orders\/[\w-]+(?:\/confirmation)?\/?$/.test(
        path,
      )
    )
      return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}
