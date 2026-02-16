import { db } from "@/server/db";
import { carts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getCartWithTotal(cartId: string) {
  const items = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  });

  if (!items) return null;

  const totalPrice = items.items.reduce(
    (totalPrice, item) =>
      totalPrice + Number(item.quantity * item.product.price),
    0,
  );

  return {
    ...items,
    totalPrice,
  };
}
