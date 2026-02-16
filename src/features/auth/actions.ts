"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import * as authService from "@/server/services/auth.service";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { carts } from "@/server/db/schema";
import { mergeCarts } from "@/features/cart/utils";
import { redirect } from "next/navigation";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const cookieStore = await cookies();

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { username, password } = parsed.data;

  try {
    const newUser = await authService.signup(username, password);

    const userAgent = (await headers()).get("user-agent") || "unknown-device";

    const { refreshToken, accessToken } = await authService.loginUser(
      newUser.id,
      "user",
      userAgent,
    );

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
  } catch (error) {
    if (error instanceof Error) return { error: error.message };

    return { error: "Something went wrong druing signup." };
  }

  redirect("/dashboard");
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) return { error: "Invalid input data." };

  const { username, password } = parsed.data;

  try {
    const user = await authService.verifyUser(username, password);

    const userAgent = (await headers()).get("user-agent") || "unknown-device";

    const { refreshToken, accessToken } = await authService.loginUser(
      user.id,
      "user",
      userAgent,
    );

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    const guestCartId = cookieStore.get("guest_cart_id")?.value;

    if (guestCartId) {
      const existingUserCart = await db.query.carts.findFirst({
        where: eq(carts.userId, user.id),
      });

      if (existingUserCart) {
        await mergeCarts(guestCartId, existingUserCart.id);
      } else {
        await db
          .update(carts)
          .set({ userId: user.id })
          .where(eq(carts.id, guestCartId));
      }

      cookieStore.delete("guest_cart_id");
    }
  } catch (error) {
    return { error: "Invalid username or password" };
  }

  const redirectTo = formData.get("redirectTo") as string;

  redirect(redirectTo || "/dashboard");
}

export async function logoutAction() {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");

  redirect("/login");
}
