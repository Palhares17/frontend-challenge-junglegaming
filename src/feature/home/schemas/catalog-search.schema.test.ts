import { describe, expect, it } from 'vitest';
import {
  defaultCatalogSearch,
  parseCatalogSearch,
} from './catalog-search.schema';

describe('catalog URL state', () => {
  it('opens the reference collection on the first visit', () => {
    expect(parseCatalogSearch({})).toEqual(defaultCatalogSearch);
  });

  it('preserves an explicitly empty selection across refresh', () => {
    expect(parseCatalogSearch({ collections: [] }).collections).toEqual([]);
  });

  it('drops unknown options, duplicates and invalid page/sort/tab values', () => {
    expect(
      parseCatalogSearch({
        collections: ['music', 'music', 'other'],
        networks: ['ethereum', 'other'],
        page: 'abc',
        sort: 'sql',
        tab: null,
      }),
    ).toMatchObject({
      collections: ['music'],
      networks: ['ethereum'],
      page: 1,
      sort: 'recent',
      tab: 'all',
    });
  });

  it('normalizes inverted bounds, oversized search and page limits', () => {
    expect(
      parseCatalogSearch({
        min: 1230,
        max: 2,
        q: `  ${'a'.repeat(110)} `,
        page: 90000,
      }),
    ).toMatchObject({ min: 2, max: 1230, q: 'a'.repeat(100), page: 10000 });
  });
});
