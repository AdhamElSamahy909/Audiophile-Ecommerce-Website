"use server";

import Stripe from "stripe";
import { getCartWithTotal } from "../cart/queries";
import { db } from "@/server/db";
import { Order, orders } from "@/server/db/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is missing from environment variables!");
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function createPaymentIntent() {
  const cart = await getCartWithTotal();

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty or could not be found.");
  }

  const amountInCents = Math.round(cart.totalPrice * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "egp",
    metadata: { cartId: cart.id },
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function makePurchase(newOrder: Order) {
  await db.transaction(async (t) => {
    await t.insert(orders).values(newOrder);
  });
}
