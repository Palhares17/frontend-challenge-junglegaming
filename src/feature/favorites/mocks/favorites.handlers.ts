import { http, HttpResponse } from "msw";
import { requireUser } from "@/core/mocks/accounts";
import { getNft } from "@/core/mocks/cart";
import { readDatabase, transaction } from "@/core/mocks/database";
import { mockResolver } from "@/core/mocks/http";

export const favoriteHandlers = [
  http.get(
    "*/api/favorites",
    mockResolver(() => {
      const owner = requireUser();
      const db = readDatabase();
      return HttpResponse.json({
        items: (db.favorites[owner] ?? []).map((id) => getNft(db, id)),
      });
    }),
  ),
  http.put(
    "*/api/favorites/:id",
    mockResolver(({ params }) => {
      const owner = requireUser();
      return HttpResponse.json(
        transaction((db) => {
          const nft = getNft(db, String(params.id));
          const ids = (db.favorites[owner] ??= []);
          if (!ids.includes(nft.id)) ids.push(nft.id);
          return { items: ids.map((id) => getNft(db, id)) };
        }),
      );
    }, "mutation"),
  ),
  http.delete(
    "*/api/favorites/:id",
    mockResolver(({ params }) => {
      const owner = requireUser();
      transaction((db) => {
        db.favorites[owner] = (db.favorites[owner] ?? []).filter(
          (id) => id !== params.id,
        );
      });
      return new HttpResponse(null, { status: 204 });
    }, "mutation"),
  ),
];
