import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose/jwt/sign";
import argon2 from "argon2";
import { jwtVerify } from "jose";
import { redis } from "@/server/redis/client";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

type AccessTokenPayload = {
  userId: string;
  jti: string;
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

export type AuthUser = {
  id: string;
  username: string;
}

export async function verifyAccessToken(token: string): Promise<AuthUser | null>{
  try {
    const {payload} = await jwtVerify(token, ACCESS_TOKEN_SECRET)

    console.log("Payload: ", payload);
    
    const userId = payload.userId as string;
    const jti = payload.jti;
    
    if (!userId || !jti) {
      return null;
    }

    const isRevoked = await redis.get(`denylist:${jti}`);
    if (isRevoked) {
      return null;
    }
    
    const [user] = await db.select({
      id: users.id,
      username: users.username
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}