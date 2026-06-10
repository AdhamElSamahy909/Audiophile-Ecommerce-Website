"use server";

import { db } from "@/server/db";
import { carts, CartWithTotal } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSession } from "../auth/session";

export async function getCartWithTotal(): Promise<CartWithTotal | null> {
  const cookieStore = await cookies();
  const user = await getSession();

  let activeCartId: string | undefined = undefined;

  if (user) {
    const userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id),
      columns: { id: true },
    });

    if (userCart) {
      activeCartId = userCart.id;
    }
  } else {
    const guestCarId = cookieStore.get("guest_cart_id")?.value;

    if (guestCarId) {
      activeCartId = guestCarId;
    }
  }

  console.log("Active Cart ID: ", activeCartId);
  if (!activeCartId) return null;

  const items = await db.query.carts.findFirst({
    where: eq(carts.id, activeCartId as string),
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
