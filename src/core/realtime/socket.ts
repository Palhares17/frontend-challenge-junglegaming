import { io, type Socket } from "socket.io-client";
import type {
  ClientEvents,
  ServerEvents,
} from "@/core/entities/marketplace.entity";

/** Consumers own subscription cleanup and REST reconciliation on connect. */
export function createMarketplaceSocket(
  url = window.location.origin,
  sessionId?: string,
): Socket<ServerEvents, ClientEvents> {
  return io(url, {
    path: "/socket.io/kurio",
    query: sessionId ? { sessionId } : {},
    transports: ["websocket"],
    autoConnect: false,
    forceNew: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
  });
}
