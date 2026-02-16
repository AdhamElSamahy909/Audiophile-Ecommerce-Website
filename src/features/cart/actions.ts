import { db } from "@/server/db";
import { cartItems, carts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addToCart(productId: string, quantity: number = 1) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("guest_cart_id")?.value;

  if (!cartId) {
    const [newCart] = await db
      .insert(carts)
      .values({ userId: null })
      .returning({ id: carts.id });

    cartId = newCart.id;

    cookieStore.set("guest_cart_id", cartId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const existingItem = await db.query.cartItems.findFirst({
    where: (items, { and, eq }) =>
      and(eq(items.cartId, cartId as string), eq(items.productId, productId)),
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
      cartId,
    });
  }

  revalidatePath("/");
}
