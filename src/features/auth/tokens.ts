import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose/jwt/sign";
import argon2 from "argon2";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

type AccessTokenPayload = {
  userId: string;
};

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET,
);

export async function generateAccessToken(
  payload: AccessTokenPayload,
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_TOKEN_SECRET);
}

export async function verifyUser(username: string, plainPassword: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) throw new Error("Invalid username or password");

  const isValid = await argon2.verify(user.passwordhash, plainPassword);

  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  return user;
}
