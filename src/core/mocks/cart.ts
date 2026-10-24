import type {
  CartData,
  CartEntry,
  CartLine,
  EditionId,
  InventoryNft,
  Quote,
} from "@/core/entities/marketplace.entity";
import { ethToWei } from "@/core/lib/eth";
import { emptyCart, nextId, type Database, type StoredCart } from "./database";
import { invalid, missing, MockError, objectInput, text } from "./errors";

export function weiToEth(value: bigint): string {
  return `${value / 10n ** 18n}.${(value % 10n ** 18n).toString().padStart(18, "0").replace(/0+$/, "").padEnd(2, "0")}`;
}
export function getNft(db: Database, id: string): InventoryNft {
  return db.nfts.find((nft) => nft.id === id) ?? missing();
}
export function getCart(db: Database, owner: string): StoredCart {
  return (db.carts[owner] ??= emptyCart());
}
export function cartLine(db: Database, entry: CartEntry): CartLine {
  const nft = getNft(db, entry.nftId);
  const edition =
    nft.editions.find((item) => item.id === entry.editionId) ?? missing();
  return {
    ...entry,
    name: nft.name,
    tokenId: nft.name.split("#")[1] ?? nft.id,
    image: nft.image,
    edition: edition.label,
    price: nft.price,
    total: weiToEth(ethToWei(nft.price) * BigInt(entry.quantity)),
    available: edition.available,
    nftVersion: nft.version,
  };
}
export function cartData(db: Database, owner: string): CartData {
  const cart = getCart(db, owner);
  const items = cart.items.map((entry) => cartLine(db, entry));
  const subtotal = items.reduce((sum, item) => sum + ethToWei(item.total), 0n);
  const coupon = cart.coupon
    ? Object.hasOwn(db.coupons, cart.coupon)
      ? db.coupons[cart.coupon]
      : undefined
    : undefined;
  const couponError = !cart.coupon
    ? null
    : !coupon
      ? "COUPON_INVALID"
      : coupon.expired
        ? "COUPON_EXPIRED"
        : null;
  const discount =
    coupon && !couponError ? (subtotal * BigInt(coupon.percent)) / 100n : 0n;
  const fee = items.length ? ethToWei(db.fee) : 0n;
  return {
    version: cart.version,
    items,
    totals: {
      subtotal: weiToEth(subtotal),
      discount: weiToEth(discount),
      networkFee: weiToEth(fee),
      total: weiToEth(subtotal - discount + fee),
    },
    coupon: cart.coupon,
    couponError,
    related: db.nfts.slice(0, 4),
  };
}
export function validateStock(db: Database, entries: CartEntry[]) {
  for (const entry of entries) {
    const line = cartLine(db, entry);
    if (entry.quantity > line.available)
      throw new MockError(
        409,
        "STOCK_CONFLICT",
        "Quantidade indisponível para esta edição.",
        { quantity: `Disponível: ${line.available}.` },
      );
  }
}
function quantityInput(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > 100
  )
    invalid({ quantity: "Informe quantidade inteira entre 1 e 100." });
  return value;
}
export function addCartItem(db: Database, owner: string, value: unknown) {
  const input = objectInput(value);
  const nftId = text(input.nftId, "nftId");
  const editionId = text(input.editionId, "editionId") as EditionId;
  const nft = getNft(db, nftId);
  if (!nft.editions.some((edition) => edition.id === editionId))
    invalid({ editionId: "Edição inválida." });
  const quantity = quantityInput(input.quantity);
  const cart = getCart(db, owner);
  const id = `${nftId}:${editionId}`;
  const entry = cart.items.find((item) => item.id === id);
  const next = {
    id,
    nftId,
    editionId,
    quantity: (entry?.quantity ?? 0) + quantity,
  };
  validateStock(db, [next]);
  if (entry) entry.quantity = next.quantity;
  else cart.items.push(next);
  cart.version++;
  return cartData(db, owner);
}
export function updateCartItem(
  db: Database,
  owner: string,
  id: string,
  value: unknown,
) {
  const entry =
    getCart(db, owner).items.find((item) => item.id === id) ?? missing();
  entry.quantity = quantityInput(objectInput(value).quantity);
  validateStock(db, [entry]);
  getCart(db, owner).version++;
  return cartData(db, owner);
}
export function removeCartItem(db: Database, owner: string, id: string) {
  const cart = getCart(db, owner);
  if (!cart.items.some((item) => item.id === id)) missing();
  cart.items = cart.items.filter((item) => item.id !== id);
  cart.version++;
  return cartData(db, owner);
}
export function applyCoupon(db: Database, owner: string, value: unknown) {
  const code = text(objectInput(value).code, "code", 40).toUpperCase();
  const coupon = Object.hasOwn(db.coupons, code) ? db.coupons[code] : undefined;
  if (!coupon || coupon.expired)
    throw new MockError(
      422,
      coupon ? "COUPON_EXPIRED" : "COUPON_INVALID",
      coupon ? "Cupom expirado." : "Cupom inválido.",
      { code: coupon ? "Cupom expirado." : "Cupom inválido." },
    );
  getCart(db, owner).coupon = code;
  getCart(db, owner).version++;
  return cartData(db, owner);
}
export function mergeGuestCart(db: Database, owner: string) {
  const guest = getCart(db, "guest");
  const cart = getCart(db, owner);
  for (const entry of guest.items) {
    const existing = cart.items.find((item) => item.id === entry.id);
    // Preserve intent even if availability changed; quote reports the conflict.
    if (existing) existing.quantity += entry.quantity;
    else cart.items.push({ ...entry });
  }
  if (guest.items.length) {
    cart.version++;
    cart.coupon ??= guest.coupon;
  }
  db.carts.guest = emptyCart();
}
export function quoteFingerprint(db: Database, owner: string): string {
  const cart = cartData(db, owner);
  return JSON.stringify({
    version: cart.version,
    items: cart.items,
    totals: cart.totals,
    coupon: cart.coupon,
    couponError: cart.couponError,
  });
}
export function createQuote(
  db: Database,
  owner: string,
  now = Date.now(),
): Quote {
  const cart = cartData(db, owner);
  if (!cart.items.length)
    throw new MockError(409, "EMPTY_CART", "Adicione NFTs antes de continuar.");
  if (cart.couponError)
    throw new MockError(422, cart.couponError, "Remova ou substitua o cupom.");
  validateStock(db, getCart(db, owner).items);
  const quote: Quote = {
    id: nextId(db, "quote"),
    ownerId: owner,
    fingerprint: quoteFingerprint(db, owner),
    expiresAt: now + 300_000,
    items: structuredClone(cart.items),
    totals: { ...cart.totals },
    coupon: cart.coupon,
  };
  db.quotes[quote.id] = quote;
  return quote;
}
