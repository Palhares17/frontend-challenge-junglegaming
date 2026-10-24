import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from '@tanstack/react-query';
import { listNftsService } from '../services/list-nfts/list-nfts.service';
import type { CatalogSearch } from '../schemas/catalog-search.schema';

export function catalogOptions(search: CatalogSearch) {
  return queryOptions({
    queryKey: ['nfts', 'catalog', search],
    queryFn: ({ signal }) => listNftsService(search, signal),
    placeholderData: keepPreviousData,
  });
}

export function useCatalog(search: CatalogSearch) {
  return useQuery(catalogOptions(search));
}
