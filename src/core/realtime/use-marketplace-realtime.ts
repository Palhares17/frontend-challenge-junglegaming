import { waitForApi } from "@/core/services/api/readiness";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { MarketplaceEvent } from "@/core/entities/marketplace.entity";
import { sessionOptions, type Session } from "@/core/session/session";
import type { Socket } from "socket.io-client";
import type {
  ClientEvents,
  ServerEvents,
} from "@/core/entities/marketplace.entity";

export function useMarketplaceRealtime(session?: Session) {
  const client = useQueryClient();
  const sessionId = session?.sessionId;
  useEffect(() => {
    let active = true;
    const versions = new Map<string, number>();
    let socket: Socket<ServerEvents, ClientEvents> | undefined;
    const current = () =>
      active &&
      client.getQueryData(sessionOptions.queryKey)?.sessionId === sessionId;
    const reconcile = () => {
      if (!current()) return;
      void client.invalidateQueries({ queryKey: ["nfts"] });
      void client.invalidateQueries({ queryKey: ["cart"] });
      void client.invalidateQueries({ queryKey: ["private"] });
    };
    function accept(name: string, event: MarketplaceEvent) {
      if (!current() || !Number.isSafeInteger(event.version)) return false;
      const key = `${name}:${event.resourceId}`;
      if ((versions.get(key) ?? 0) >= event.version) return false;
      versions.set(key, event.version);
      return true;
    }

    async function start() {
      // Load Socket.IO after MSW bootstrap: the client captures WebSocket at import.
      await waitForApi();
      const { createMarketplaceSocket } = await import("./socket");
      if (!active) return;
      socket = createMarketplaceSocket(undefined, sessionId);
      socket.on("connect", reconcile);
      socket.on("disconnect", () => {
        if (current())
          toast(
            "Conexão interrompida. Os dados serão conferidos ao reconectar.",
            { id: "realtime", duration: 5000 },
          );
      });

      socket.on("nft.updated", (event) => {
        if (!accept("nft", event)) return;
        void client.invalidateQueries({ queryKey: ["nfts"] });
        void client.invalidateQueries({ queryKey: ["cart"] });
        void client.invalidateQueries({
          queryKey: ["private"],
          predicate: (q) =>
            q.queryKey[2] === "checkout" || q.queryKey[2] === "favorites",
        });
        toast("Preço ou disponibilidade atualizados. Revise sua compra.", {
          id: "inventory-update",
        });
      });

      socket.on("order.updated", (event) => {
        if (!accept("order", event)) return;
        void client.invalidateQueries({
          queryKey: ["private"],
          predicate: (q) =>
            q.queryKey[2] === "order" && q.queryKey[3] === event.resourceId,
        });
        void client.invalidateQueries({ queryKey: ["cart"] });
        void client.invalidateQueries({
          queryKey: ["private"],
          predicate: (q) => q.queryKey[2] === "checkout",
        });
      });
      
      socket.on("session.expired", () => {
        if (current())
          client.setQueryData(sessionOptions.queryKey, { user: null });
      });
      socket.connect();
    }
    void start().catch(() => {
      if (active)
        toast.error(
          "Não foi possível conectar as atualizações. Recarregue para tentar novamente.",
        );
    });
    return () => {
      active = false;
      socket?.removeAllListeners();
      socket?.disconnect();
    };
  }, [client, sessionId]);
}
