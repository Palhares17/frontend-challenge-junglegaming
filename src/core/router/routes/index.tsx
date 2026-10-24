import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/feature/home/views/home.page';
import { parseCatalogSearch } from '@/feature/home/schemas/catalog-search.schema';
export const Route = createFileRoute('/')({
  validateSearch: parseCatalogSearch,
  component: HomePage,
});
