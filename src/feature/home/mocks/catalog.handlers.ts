import { http, HttpResponse } from "msw";
import { readDatabase, readLocal } from "@/core/mocks/database";
import { scenario as apiScenario } from "@/core/mocks/scenarios";
import { mockResolver } from "@/core/mocks/http";
import { invalid } from "@/core/mocks/errors";
import { ethToWei } from "@/core/lib/eth";
import type { CatalogResponse } from "../entities/catalog.entity";

export const catalogHandlers = [
  http.get(
    "*/api/nfts",
    mockResolver(({ request }) => {
      const catalogFixtures = readDatabase().nfts;
      const scenario = readLocal("kurio:mock-scenario") ?? "default";
      const params = new URL(request.url).searchParams;
      const collections = params.getAll("collection");
      const networks = params.getAll("network");
      const q = (params.get("q") ?? "").toLocaleLowerCase("pt-BR");
      const minValue = params.get("min") ?? "0.02";
      const maxValue = params.get("max") ?? "12.30";
      if (
        ![minValue, maxValue].every((value) => /^\d+(\.\d{1,18})?$/.test(value))
      )
        invalid({ price: "Faixa ETH inválida." });
      const min = ethToWei(minValue);
      const max = ethToWei(maxValue);
      const page = Number(params.get("page") ?? 1);
      if (!Number.isSafeInteger(page) || page < 1 || min > max)
        invalid({ page: "Página ou faixa inválida." });
      const tab = params.get("tab");
      let items = catalogFixtures.filter(
        (item) =>
          (!collections.length || collections.includes(item.collection)) &&
          (!networks.length || networks.includes(item.network)) &&
          (!q || item.name.toLocaleLowerCase("pt-BR").includes(q)) &&
          ethToWei(item.price) >= min &&
          ethToWei(item.price) <= max &&
          (tab !== "new" || item.isNew) &&
          (tab !== "trending" || item.isTrending),
      );
      const sort = params.get("sort");
      if (sort === "price-asc" || sort === "price-desc") {
        items = [...items].sort((a, b) => {
          const left = ethToWei(a.price);
          const right = ethToWei(b.price);
          const order = left < right ? -1 : left > right ? 1 : 0;
          return sort === "price-desc" ? -order : order;
        });
      }
      if (scenario === "empty" || apiScenario() === "empty") items = [];
      const facets: CatalogResponse["facets"] = {
        collections: {},
        networks: {},
      };
      for (const item of catalogFixtures) {
        facets.collections[item.collection] =
          (facets.collections[item.collection] ?? 0) + 1;
        facets.networks[item.network] =
          (facets.networks[item.network] ?? 0) + 1;
      }
      return HttpResponse.json<CatalogResponse>({
        items: items.slice((page - 1) * 9, page * 9),
        total: items.length,
        page,
        pageSize: 9,
        facets,
      });
    }, "catalog"),
  ),
];
