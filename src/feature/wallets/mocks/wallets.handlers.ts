import { http, HttpResponse } from "msw";
import { networkInput, requireUser, saveWallet } from "@/core/mocks/accounts";
import { readDatabase, transaction } from "@/core/mocks/database";
import { missing, MockError, objectInput, text } from "@/core/mocks/errors";
import { mockResolver } from "@/core/mocks/http";
import { scenario } from "@/core/mocks/scenarios";

export const walletHandlers = [
  http.get(
    "*/api/wallets",
    mockResolver(() =>
      HttpResponse.json({ items: readDatabase().wallets[requireUser()] ?? [] }),
    ),
  ),

  http.post(
    "*/api/wallets",
    mockResolver(async ({ request }) => {
      const owner = requireUser();
      const input = await request.json();
      return HttpResponse.json(
        transaction((db) => saveWallet(db, owner, input)),
        { status: 201 },
      );
    }, "mutation"),
  ),

  http.patch(
    "*/api/wallets/:id",
    mockResolver(async ({ request, params }) => {
      const owner = requireUser();
      const input = await request.json();
      return HttpResponse.json(
        transaction((db) => saveWallet(db, owner, input, String(params.id))),
      );
    }, "mutation"),
  ),
  
  http.post(
    "*/api/wallet-connection",
    mockResolver(async ({ request }) => {
      const owner = requireUser();
      const input = objectInput(await request.json());
      const walletId = text(input.walletId, "walletId");
      const network = networkInput(input.network);
      if (scenario() === "wallet-rejected")
        throw new MockError(
          409,
          "WALLET_REJECTED",
          "Conexão recusada pelo usuário na simulação.",
        );
      return HttpResponse.json(
        transaction((db) => {
          const wallet =
            db.wallets[owner]?.find((item) => item.id === walletId) ??
            missing();
          if (network !== wallet.network)
            throw new MockError(
              409,
              "NETWORK_MISMATCH",
              "Selecione a rede da carteira.",
            );
          db.connections[owner] = {
            walletId,
            network,
            status:
              scenario() === "wallet-disconnected"
                ? "disconnected"
                : "connected",
          };
          return db.connections[owner];
        }),
      );
    }, "mutation"),
  ),
  http.delete(
    "*/api/wallet-connection",
    mockResolver(() => {
      transaction((db) => {
        db.connections[requireUser()] = null;
      });
      return new HttpResponse(null, { status: 204 });
    }, "mutation"),
  ),
];
