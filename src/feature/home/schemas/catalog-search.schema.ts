export const collectionOptions = [
  { value: 'digital-art', label: 'Arte digital' },
  { value: 'photography', label: 'Fotografia' },
  { value: 'music', label: 'Música' },
  { value: '3d-art', label: 'Arte 3D' },
  { value: 'collectibles', label: 'Colecionáveis' },
  { value: 'generative', label: 'Generativa' },
  { value: 'gaming', label: 'Jogos' },
  { value: 'memberships', label: 'Assinaturas' },
  { value: 'utility', label: 'Utilidade' },
] as const;

export const networkOptions = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'solana', label: 'Solana' },
] as const;

export const sortOptions = [
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
] as const;

export const catalogTabs = [
  { value: 'all', label: 'Todos os NFTs' },
  { value: 'new', label: 'Novos lançamentos' },
  { value: 'trending', label: 'Em alta' },
] as const;

export interface CatalogSearch {
  q: string;
  collections: string[];
  networks: string[];
  min: number;
  max: number;
  sort: (typeof sortOptions)[number]['value'];
  tab: (typeof catalogTabs)[number]['value'];
  page: number;
}

export const defaultCatalogSearch: CatalogSearch = {
  q: '',
  collections: ['digital-art'],
  networks: [],
  min: 2,
  max: 1230,
  sort: 'recent',
  tab: 'all',
  page: 1,
};

function selectedValues(
  value: unknown,
  allowed: readonly string[],
  fallback: string[],
) {
  if (value === undefined) return [...fallback];
  const values = Array.isArray(value) ? value : [value];
  return [
    ...new Set(
      values.filter(
        (item): item is string =>
          typeof item === 'string' && allowed.includes(item),
      ),
    ),
  ];
}

function integer(value: unknown, fallback: number, min: number, max: number) {
  if (typeof value !== 'number' && typeof value !== 'string') return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : fallback;
}

export function parseCatalogSearch(
  input: Record<string, unknown>,
): CatalogSearch {
  const min = integer(input.min, 2, 2, 1230);
  const max = integer(input.max, 1230, 2, 1230);
  return {
    q: typeof input.q === 'string' ? input.q.trim().slice(0, 100) : '',
    collections: selectedValues(
      input.collections,
      collectionOptions.map((item) => item.value),
      ['digital-art'],
    ),
    networks: selectedValues(
      input.networks,
      networkOptions.map((item) => item.value),
      [],
    ),
    min: Math.min(min, max),
    max: Math.max(min, max),
    sort:
      sortOptions.find((item) => item.value === input.sort)?.value ?? 'recent',
    tab: catalogTabs.find((item) => item.value === input.tab)?.value ?? 'all',
    page: integer(input.page, 1, 1, 10_000),
  };
}
