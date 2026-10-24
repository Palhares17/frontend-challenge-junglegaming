const base = '/assets/figma/';

export const artwork = {
  emerald: '/assets/artwork/emerald.webp',
  sage: '/assets/artwork/sage.webp',
  neon: '/assets/artwork/neon.webp',
  golden: '/assets/artwork/golden.webp',
} as const;

export const decoration = {
  heroDesktop: `${base}desktop-rectangle3.svg`,
  heroMobile: `${base}mobile-mask-group.svg`,
  heroDots: `${base}desktop-group4.svg`,
  heroDotsMobile: `${base}mobile-frame4.svg`,
  promo: `${base}desktop-mask-group.svg`,
  navigation: `${base}mobile-vector.svg`,
  navigationAction: `${base}mobile-ellipse39.svg`,
  activeNavigation: `${base}desktop-active-underline.svg`,
} as const;

// Dimensions are the exported SVG root dimensions, not the touch target.
export const icons = {
  search: { src: `${base}desktop-search-icon.svg`, width: 20.0009, height: 20 },
  searchMobile: { src: `${base}mobile-search.svg`, width: 22, height: 22 },
  cart: { src: `${base}desktop-cart-icon.svg`, width: 24.0042, height: 24 },
  signIn: { src: `${base}desktop-logout.svg`, width: 17.7779, height: 16.9167 },
  filter: { src: `${base}mobile-filter.svg`, width: 16.1463, height: 16.1066 },
  down: {
    src: `${base}desktop-arrow-down2.svg`,
    width: 10.8333,
    height: 6.16667,
  },
  arrow: {
    src: `${base}desktop-arrow-right.svg`,
    width: 10.537,
    height: 12.75,
  },
  arrowMobile: {
    src: `${base}mobile-arrow-right.svg`,
    width: 9.53296,
    height: 11.5,
  },
  next: {
    src: `${base}desktop-arrow-right2.svg`,
    width: 12.0002,
    height: 6.75012,
  },
  favorite: { src: `${base}mobile-frame410.svg`, width: 28, height: 28 },
  heart: { src: `${base}mobile-vector1.svg`, width: 20, height: 17.7936 },
  heartFilled: { src: '/assets/icons/heart-filled.svg', width: 20, height: 20 },
  home: { src: `${base}mobile-home.svg`, width: 15.8333, height: 16.6668 },
  shop: { src: `${base}mobile-shop.svg`, width: 20, height: 20 },
  user: { src: `${base}mobile-user.svg`, width: 20, height: 20 },
  facebook: { src: `${base}desktop-frame108.svg`, width: 32, height: 32 },
  instagram: { src: `${base}desktop-frame109.svg`, width: 32, height: 32 },
  twitter: { src: `${base}desktop-frame110.svg`, width: 32, height: 32 },
  linkedin: { src: `${base}desktop-frame111.svg`, width: 32, height: 32 },
  youtube: { src: `${base}desktop-frame112.svg`, width: 32, height: 32 },
} as const;

export type IconName = keyof typeof icons;
