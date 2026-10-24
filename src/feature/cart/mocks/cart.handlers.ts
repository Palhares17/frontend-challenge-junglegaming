import { http, HttpResponse } from "msw";
import { cartOwner, requireUser } from "@/core/mocks/accounts";
import {
  addCartItem,
  applyCoupon,
  cartData,
  createQuote,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/core/mocks/cart";
import { transaction } from "@/core/mocks/database";
import { mockResolver } from "@/core/mocks/http";

export const cartHandlers = [
  http.post(
    "*/api/cart/items",
    mockResolver(async ({ request }) => {
      const owner = cartOwner();
      const input = await request.json();
      return HttpResponse.json(
        transaction((db) => addCartItem(db, owner, input)),
        { status: 201 },
      );
    }, "mutation"),
  ),
  http.patch(
    "*/api/cart/items/:id",
    mockResolver(async ({ request, params }) => {
      const owner = cartOwner();
      const input = await request.json();
      return HttpResponse.json(
        transaction((db) =>
          updateCartItem(db, owner, String(params.id), input),
        ),
      );
    }, "mutation"),
  ),
  http.delete(
    "*/api/cart/items/:id",
    mockResolver(
      ({ params }) =>
        HttpResponse.json(
          transaction((db) =>
            removeCartItem(db, cartOwner(), String(params.id)),
          ),
        ),
      "mutation",
    ),
  ),
  http.post(
    "*/api/cart/coupon",
    mockResolver(async ({ request }) => {
      const owner = cartOwner();
      const input = await request.json();
      return HttpResponse.json(
        transaction((db) => applyCoupon(db, owner, input)),
      );
    }, "mutation"),
  ),
  http.delete(
    "*/api/cart/coupon",
    mockResolver(
      () =>
        HttpResponse.json(
          transaction((db) => {
            const owner = cartOwner();
            const cart = getCart(db, owner);
            cart.coupon = null;
            cart.version++;
            return cartData(db, owner);
          }),
        ),
      "mutation",
    ),
  ),
  http.post(
    "*/api/quotes",
    mockResolver(
      () =>
        HttpResponse.json(
          transaction((db) => createQuote(db, requireUser())),
          { status: 201 },
        ),
      "mutation",
    ),
  ),
];
