import type { InventoryNft } from '@/core/entities/marketplace.entity';

export interface CatalogResponse {
  items: InventoryNft[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    collections: Record<string, number>;
    networks: Record<string, number>;
  };
}
