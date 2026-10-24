import { http, HttpResponse } from 'msw';
import { collectionOptions } from '@/feature/home/schemas/catalog-search.schema';
import type { NftDetailsResponse } from '@/feature/nft/services/get-nft.service';
import { requireUser, cartOwner } from './accounts';
import { readDatabase, transaction } from './database';
import { cartData } from './cart';
import { checkoutData } from './orders';
import { missing } from './errors';
import { mockResolver } from './http';

export const navigationHandlers = [
  http.get('*/api/nfts/:id', mockResolver(({ params }) => {
    const catalog = readDatabase().nfts;
    const item = catalog.find((nft) => nft.id === params.id);
    if (!item) return missing();
    return HttpResponse.json<NftDetailsResponse>({
      nft: {
        ...item,
        tokenId: item.name.split('#')[1] ?? item.id,
        collectionName:
          collectionOptions.find((option) => option.value === item.collection)
            ?.label ?? item.collection,
        attributes: 'Arte digital',
        rating: '4.8',
        ratingCount: 24,
        description:
          'Uma obra digital da coleção Kurio. Explore sua arte, rede e informações do token.',
        mobileDescription: 'Uma obra digital da coleção Kurio.',
        story: [
          'Obra disponibilizada no catálogo simulado para explorar a coleção.',
        ],
        networkInfo: item.network,
        contractInfo: 'Contrato simulado',
        royaltyInfo: 'Não definido na demonstração',
        gallery: [{ src: item.image, alt: item.imageAlt }],
      },
      related: catalog.filter((nft) => nft.id !== item.id).slice(0, 4),
    });
  })),
  http.get('*/api/cart', mockResolver(() => HttpResponse.json(transaction((db) => cartData(db, cartOwner()))))),
  http.get('*/api/checkout', mockResolver(() => HttpResponse.json(transaction((db) => checkoutData(db, requireUser()))))),
  http.get('*/api/orders/:id', mockResolver(({ params }) => {
    const owner = requireUser();
    const order = readDatabase().orders[String(params.id)];
    if (!order || order.ownerId !== owner) return missing();
    return HttpResponse.json(order.response);
  })),
];
