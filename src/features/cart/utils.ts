import { db } from "@/server/db";
import { cartItems, carts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function mergeCarts(guestCartId: string, userCartId: string) {
  await db.transaction(async (tx) => {
    const guestItems = await tx.query.cartItems.findMany({
      where: eq(cartItems.cartId, guestCartId),
    });

    if (guestItems.length === 0) {
      await tx.delete(carts).where(eq(carts.id, guestCartId));
    }

    const userItems = await tx.query.cartItems.findMany({
      where: eq(cartItems.cartId, userCartId),
    });

    for (const gItem of guestItems) {
      const existingMatch = userItems.find(
        (uItem) => uItem.productId === gItem.productId,
      );

      if (existingMatch) {
        await tx
          .update(cartItems)
          .set({ quantity: gItem.quantity + existingMatch.quantity })
          .where(eq(cartItems.id, existingMatch.id));
      } else {
        await tx
          .update(cartItems)
          .set({ cartId: userCartId })
          .where(eq(cartItems.id, gItem.id));
      }
    }

    await tx.delete(carts).where(eq(carts.id, guestCartId));
  });
}
