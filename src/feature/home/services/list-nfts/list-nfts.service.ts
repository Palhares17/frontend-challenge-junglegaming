import { api } from '@/core/services/api/api';
import { centsToEth } from '@/core/lib/eth';
import type { CatalogResponse } from '../../entities/catalog.entity';
import type { CatalogSearch } from '../../schemas/catalog-search.schema';

export async function listNftsService(
  search: CatalogSearch,
  signal: AbortSignal,
) {
  const params = new URLSearchParams({
    q: search.q,
    min: centsToEth(search.min),
    max: centsToEth(search.max),
    sort: search.sort,
    tab: search.tab,
    page: String(search.page),
  });
  search.collections.forEach((value) => params.append('collection', value));
  search.networks.forEach((value) => params.append('network', value));
  const { data } = await api.get<CatalogResponse>('/nfts', { params, signal });
  return data;
}
