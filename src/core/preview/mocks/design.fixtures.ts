import { artwork } from '@/core/lib/assets';
import type { Nft } from '@/core/entities/nft.entity';
import type {
  OrderLineItem,
  OrderTotals,
} from '@/core/entities/order-presentation.entity';
import type { NftPresentation } from '@/feature/nft/entities/nft-presentation.entity';
import type { OrderReceiptPresentation } from '@/feature/orders/entities/order-receipt-presentation.entity';

/** Figma specimens only: these are not account, quote, or purchase API responses. */
const specimen = {
  collection: 'digital-art',
  network: 'ethereum',
  isNew: false,
  isTrending: false,
  isRare: false,
};
export const relatedNfts: Nft[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Bloom #118',
    image: artwork.sage,
    imageAlt: 'Macaco com chapéu e roupa roxa',
    price: '1.29',
    ...specimen,
  },
  {
    id: 'violet',
    name: 'Violet Nomad #314',
    image: artwork.sage,
    imageAlt: 'Macaco com chapéu e roupa roxa',
    price: '1.39',
    ...specimen,
  },
  {
    id: 'ivory',
    name: 'Ivory Baron #088',
    image: artwork.neon,
    imageAlt: 'Macaco de paletó',
    price: '1.79',
    ...specimen,
  },
  {
    id: 'beat',
    name: 'Golden Beat #207',
    image: artwork.golden,
    imageAlt: 'Macaco dourado com fones',
    price: '0.99',
    ...specimen,
  },
  {
    id: 'signal',
    name: 'Golden Signal #160',
    image: artwork.golden,
    imageAlt: 'Macaco dourado com fones',
    price: '0.39',
    ...specimen,
  },
];

export const nftSpecimen: NftPresentation = {
  ...specimen,
  id: 'emerald',
  name: 'Emerald Ape #042',
  image: artwork.emerald,
  imageAlt: 'Macaco com óculos e jaqueta verde',
  price: '1.19',
  tokenId: '#0042',
  collectionName: 'Kurio Apes',
  attributes: 'Óculos, Esmeralda, Raro',
  rating: '4.8',
  ratingCount: 19,
  description:
    'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
  mobileDescription:
    'Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.',
  story: [
    'Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.',
    'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
  ],
  networkInfo:
    'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.',
  contractInfo:
    'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.',
  royaltyInfo: '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.',
  gallery: Array.from({ length: 4 }, (_, index) => ({
    src: artwork.emerald,
    alt: `Emerald Ape #042, imagem ${index + 1}`,
  })),
};

export const desktopCartItems: OrderLineItem[] = [
  {
    id: 'emerald',
    name: 'Emerald Ape #042',
    tokenId: '#0042',
    image: artwork.emerald,
    edition: '1/50',
    quantity: 2,
    price: '1.19',
    total: '2.38',
  },
  {
    id: 'violet',
    name: 'Violet Nomad #314',
    tokenId: '#0009',
    image: artwork.sage,
    edition: '1/1',
    quantity: 6,
    price: '1.39',
    total: '8.34',
  },
  {
    id: 'ivory',
    name: 'Ivory Baron #088',
    tokenId: '#0552',
    image: artwork.neon,
    edition: '1/10',
    quantity: 9,
    price: '1.79',
    total: '16.11',
  },
];
export const checkoutItems = desktopCartItems.map((item) =>
  item.id === 'ivory' ? { ...item, tokenId: '#0088' } : item,
);
export const mobileCartItems: OrderLineItem[] = [
  { ...desktopCartItems[0], quantity: 1, total: '1.19' },
  { ...desktopCartItems[1], quantity: 1, total: '1.39' },
  { ...desktopCartItems[2], quantity: 2, total: '3.58' },
  {
    id: 'beat',
    name: 'Golden Beat #207',
    tokenId: '#0207',
    image: artwork.golden,
    edition: '1/50',
    quantity: 2,
    price: '0.99',
    total: '1.98',
  },
];
export const desktopTotals: OrderTotals = {
  subtotal: '26.83',
  discount: '00.00',
  networkFee: '0.016',
  total: '26.846',
};
// The mobile Figma totals are visually preserved, although its line items sum to 8.14.
export const mobileTotals: OrderTotals = {
  subtotal: '8.92',
  discount: '00.00',
  networkFee: '0.016',
  total: '8.936',
};
export const walletSpecimens = [
  {
    id: 'reserve',
    label: 'Reserva',
    address: 'nova.kurio.eth',
    network: 'Rede Polygon',
  },
  {
    id: 'primary',
    label: 'Principal',
    address: '0xA91F…E82C',
    network: 'Rede principal Ethereum',
  },
];
export const receiptSpecimen: OrderReceiptPresentation = {
  status: 'confirmed',
  transactionId: '0xA91F…E82C',
  date: '29 Jul, 2026',
  wallet: 'MetaMask',
  items: checkoutItems,
  totals: desktopTotals,
  note: 'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.',
};

export const authItems: Nft[] = [
  { ...nftSpecimen, image: artwork.golden },
  {
    ...relatedNfts[0],
    id: 'sage-auth',
    name: 'Sage Nomad #009',
    image: artwork.neon,
    price: '1.69',
  },
  {
    ...relatedNfts[2],
    id: 'neon-auth',
    name: 'Neon Vessel #552',
    image: artwork.emerald,
    price: '1.99',
    previousPrice: '2.29',
    isRare: true,
  },
  relatedNfts[0],
  { ...relatedNfts[1], image: artwork.golden },
  relatedNfts[2],
  { ...relatedNfts[3], image: artwork.emerald },
  {
    ...relatedNfts[3],
    id: 'frequency-auth',
    name: 'Golden Frequency #071',
    image: artwork.sage,
    price: '0.59',
  },
  relatedNfts[4],
];
export const authFacets = {
  collections: {
    'digital-art': 33,
    photography: 12,
    music: 65,
    '3d-art': 39,
    collectibles: 23,
    generative: 17,
    gaming: 19,
    memberships: 13,
    utility: 18,
  },
  networks: { ethereum: 119, polygon: 78, solana: 86 },
};
