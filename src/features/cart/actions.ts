"use server";

import { db } from "@/server/db";
import { cartItems, carts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSession } from "../auth/session";

export async function addToCart(productId: string, quantity: number = 1) {
  const cookieStore = await cookies();
  const user = await getSession();

  let activeCartId: string | undefined = undefined;

  if (user) {
    const userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id),
    });

    if (!userCart) {
      const [newCart] = await db
        .insert(carts)
        .values({ userId: user.id })
        .returning({ id: carts.id });

      activeCartId = newCart.id;
    }
  } else {
    let guestCartId = cookieStore.get("guest_cart_id")?.value;
    let guestCart;

    if (guestCartId) {
      guestCart = await db.query.carts.findFirst({
        where: eq(carts.id, guestCartId),
      });
    }

    if (!guestCart) {
      const [newCart] = await db
        .insert(carts)
        .values({ userId: null })
        .returning({ id: carts.id });

      guestCartId = newCart.id;

      cookieStore.set("guest_cart_id", guestCartId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    activeCartId = guestCartId;
  }

  const existingItem = await db.query.cartItems.findFirst({
    where: (items, { and, eq }) =>
      and(
        eq(items.cartId, activeCartId as string),
        eq(items.productId, productId),
      ),
  });

  if (existingItem) {
    await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      productId,
      quantity,
      cartId: activeCartId as string,
    });
  }

  revalidatePath("/");
}
