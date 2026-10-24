import type {
  CartEntry,
  CollectorProfile,
  InventoryNft,
  Quote,
  Wallet,
  WalletConnection,
  CreateOrderInput,
} from "@/core/entities/marketplace.entity";
import type { OrderResponse } from "@/feature/orders/services/get-order.service";
import type { OrderReceiptPresentation } from "@/feature/orders/entities/order-receipt-presentation.entity";
import { catalogFixtures } from "@/feature/home/mocks/catalog.fixtures";
import { MockError } from "./errors";
import { publishMockEvent, type MockEvent } from "./events";

export const databaseKey = "kurio:mock-database:v1";

export const sessionKey = "kurio:mock-session";

export interface MockAccount {
  profile: CollectorProfile;
  salt: string;
  passwordHash: string;
}

export interface StoredCart {
  version: number;
  items: CartEntry[];
  coupon: string | null;
}

export interface StoredOrder {
  ownerId: string;
  response: OrderResponse;
  version: number;
  settleAt: number | null;
  outcome: "confirmed" | "declined";
  snapshot: OrderReceiptPresentation;
  purchase?: CreateOrderInput;
  quote?: Quote;
}
export interface Database {
  schemaVersion: 1;
  sequence: number;
  nfts: InventoryNft[];
  accounts: Record<string, MockAccount>;
  wallets: Record<string, Wallet[]>;
  connections: Record<string, WalletConnection | null>;
  favorites: Record<string, string[]>;
  carts: Record<string, StoredCart>;
  quotes: Record<string, Quote>;
  orders: Record<string, StoredOrder>;
  attempts: Record<string, { fingerprint: string; orderId: string }>;
  fee: string;
  coupons: Record<string, { percent: number; expired: boolean }>;
}
const passwordHash =
  "5967c16c2022d4e40c36c348638237f3846e004c5f74dcde8aa0373f383aa8d4";
export const emptyCart = (): StoredCart => ({
  version: 1,
  items: [],
  coupon: null,
});

export function createDatabase(
  preset: "default" | "populated" = "default",
): Database {
  const nfts: InventoryNft[] = structuredClone(catalogFixtures).map(
    (nft, index) => ({
      ...nft,
      version: 1,
      editions: [
        { id: "single", label: "1/1", available: index % 7 === 2 ? 0 : 1 },
        { id: "ten", label: "1/10", available: 10 },
        { id: "fifty", label: "1/50", available: 50 },
        { id: "open", label: "ABERTA", available: 100 },
      ],
    }),
  );
  const accounts = Object.fromEntries(
    ["Ana", "Bruno"].map((name, index) => {
      const id = `collector-${index + 1}`;
      return [
        id,
        {
          salt: "",
          passwordHash,
          profile: {
            id,
            displayName: `${name} Colecionador${index ? "" : "a"}`,
            username: name.toLowerCase(),
            email: `${name.toLowerCase()}@kurio.test`,
            ens: "",
            walletAlias: "",
            avatar: null,
          },
        },
      ];
    }),
  );
  const first = nfts[0];
  const snapshot: OrderReceiptPresentation = {
    status: "confirmed",
    transactionId: "0xkurio-demo-2026",
    date: "23/10/2026 às 10:00",
    wallet: "Carteira de demonstração · Ethereum",
    items: [
      {
        id: first.id,
        name: first.name,
        tokenId: "042",
        image: first.image,
        edition: "1/1",
        quantity: 1,
        price: first.price,
        total: first.price,
      },
    ],
    totals: {
      subtotal: first.price,
      discount: "0.00",
      networkFee: "0.01",
      total: "1.20",
    },
    note: "Pedido histórico simulado. Nenhuma compra ou transação real foi realizada.",
  };
  const orders = Object.fromEntries(
    [
      ["demo-confirmed", "collector-1", "confirmed"],
      ["demo-pending", "collector-1", "pending"],
      ["demo-declined", "collector-1", "declined"],
      ["demo-bruno", "collector-2", "confirmed"],
    ].map(([id, ownerId, status]) => {
      const receipt = {
        ...structuredClone(snapshot),
        ...(id === "demo-bruno" ? { transactionId: "0xkurio-bruno-demo" } : {}),
      };
      const response: OrderResponse =
        status === "confirmed"
          ? { id, status, receipt }
          : { id, status: status as "pending" | "declined" };
      return [
        id,
        {
          ownerId,
          response,
          snapshot: receipt,
          version: 1,
          settleAt: null,
          outcome: "confirmed" as const,
        },
      ];
    }),
  );
  const db: Database = {
    schemaVersion: 1,
    sequence: 0,
    nfts,
    accounts,
    orders,
    wallets: { "collector-1": [], "collector-2": [] },
    connections: {},
    favorites: {},
    carts: { guest: emptyCart() },
    quotes: {},
    attempts: {},
    fee: "0.01",
    coupons: {
      KURIO10: { percent: 10, expired: false },
      EXPIRED: { percent: 10, expired: true },
    },
  };
  if (preset === "populated") {
    db.carts.guest.items = [
      { id: "nft-1:ten", nftId: "nft-1", editionId: "ten", quantity: 2 },
    ];
    db.wallets["collector-1"] = [
      {
        id: "wallet-ana",
        label: "Principal Ana",
        network: "ethereum",
        address: `0x${"a".repeat(40)}`,
        primary: true,
      },
    ];
    db.wallets["collector-2"] = [
      {
        id: "wallet-bruno",
        label: "Principal Bruno",
        network: "solana",
        address: "So11111111111111111111111111111111111111112",
        primary: true,
      },
    ];
  }
  return db;
}
let memory: string | null = null;
let storageOverride:
  | Pick<Storage, "getItem" | "setItem" | "removeItem">
  | undefined;
function storage() {
  return (
    storageOverride ??
    (typeof localStorage === "undefined" ? undefined : localStorage)
  );
}
export function useMockStorage(value: typeof storageOverride) {
  storageOverride = value;
  memory = null;
}
export function readDatabase(): Database {
  try {
    const backend = storage();
    const raw = backend ? backend.getItem(databaseKey) : memory;
    if (!raw) return createDatabase();
    const db = JSON.parse(raw) as Database;
    if (
      db.schemaVersion !== 1 ||
      !Array.isArray(db.nfts) ||
      !db.accounts ||
      !db.carts
    )
      throw new Error("schema");
    return db;
  } catch {
    throw new MockError(
      503,
      "MOCK_STORAGE_ERROR",
      "Dados simulados indisponíveis. Execute o reset dos mocks.",
    );
  }
}
export function writeDatabase(db: Database) {
  try {
    const raw = JSON.stringify(db);
    storage()?.setItem(databaseKey, raw);
    memory = raw;
  } catch {
    throw new MockError(
      503,
      "MOCK_STORAGE_ERROR",
      "Não foi possível persistir os dados simulados.",
    );
  }
}
export function transaction<T>(
  operation: (db: Database, events: MockEvent[]) => T,
): T {
  const db = readDatabase();
  const events: MockEvent[] = [];
  const result = operation(db, events);
  writeDatabase(db);
  events.forEach(publishMockEvent);
  return result;
}
export function nextId(db: Database, prefix: string) {
  return `${prefix}-${++db.sequence}`;
}
export function resetDatabase(preset: "default" | "populated" = "default") {
  writeDatabase(createDatabase(preset));
}
function localOperation<T>(operation: () => T): T {
  try {
    return operation();
  } catch {
    throw new MockError(
      503,
      "MOCK_STORAGE_ERROR",
      "Não foi possível acessar a persistência dos mocks.",
    );
  }
}
export function readLocal(key: string) {
  return localOperation(() => storage()?.getItem(key) ?? null);
}
export function writeLocal(key: string, value: string) {
  localOperation(() => storage()?.setItem(key, value));
}
export function removeLocal(key: string) {
  localOperation(() => storage()?.removeItem(key));
}
