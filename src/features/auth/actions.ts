"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import * as authService from "@/features/auth/services";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { carts, refreshTokens } from "@/server/db/schema";
import { mergeCarts } from "@/features/cart/utils";
import { redirect } from "next/navigation";
import { verifyUser } from "./tokens";
import { decodeJwt } from "jose";
import { redis } from "@/server/redis/client";
import { createHash } from "crypto";
import { rateLimit } from "@/server/redis/rate-limit-node";
// import { revalidatePath } from "next/cache";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signupAction(formData: FormData) {
  const cookieStore = await cookies();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  console.log(parsed);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { username, password } = parsed.data;

  try {
    await rateLimit();
  } catch (_) {
    return { error: "Too many signup attempts. Please try again later." };
  }

  try {
    const newUser = await authService.signup(username, password);

    const userAgent = (await headers()).get("user-agent") || "unknown-device";

    console.log(userAgent);

    const { refreshToken, accessToken } = await authService.loginUser(
      newUser.id,
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    const guestCartId = cookieStore.get("guest_cart_id")?.value;

    if (guestCartId) {
      const existingUserCart = await db.query.carts.findFirst({
        where: eq(carts.userId, newUser.id),
      });

      if (existingUserCart) {
        await mergeCarts(guestCartId, existingUserCart.id);
      } else {
        await db
          .update(carts)
          .set({ userId: newUser.id })
          .where(eq(carts.id, guestCartId));
      }

      cookieStore.delete("guest_cart_id");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error object:", error);
      console.log(
        "Stack trace:",
        error instanceof Error ? error.stack : "No stack trace",
      );
      return { error: error.message };
    }

    return { error: "Something went wrong during signup." };
  }

  redirect("/");
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) return { error: "Invalid input data." };

  const { username, password } = parsed.data;

  try {
    await rateLimit();
  } catch (_) {
    return { error: "Too many login attempts. Please try again later." };
  }

  try {
    const user = await verifyUser(username, password);

    const userAgent = (await headers()).get("user-agent") || "unknown-device";

    const { refreshToken, accessToken } = await authService.loginUser(
      user.id,
      "user",
      userAgent,
    );

    console.log("access and refresh tokens: ", accessToken, refreshToken);

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

  redirect(redirectTo || "/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    try {
      const payload = decodeJwt(accessToken);

      if (payload.jti && payload.exp) {
        const timeUntilExpiry = payload.exp - Math.floor(Date.now() / 1000);

        if (timeUntilExpiry > 0) {
          await redis.set(
            `denylist:${payload.jti}`,
            "revoked",
            "EX",
            timeUntilExpiry,
          );
        }
      }
    } catch (error) {}
  }

  if (refreshToken) {
    try {
      const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

      const [tokenRecord] = await db
        .select({ familyId: refreshTokens.familyId })
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, tokenHash))
        .limit(1);

      if (tokenRecord) {
        await db
          .update(refreshTokens)
          .set({ isUsed: true })
          .where(eq(refreshTokens.tokenHash, tokenHash));
      }
    } catch (error) {
      console.error("Failed to flag refresh token as used in DB", error);
    }
  }

  cookieStore.delete("refreshToken");
  cookieStore.delete("accessToken");

  // redirect("/login");
}
