import { db } from "@/server/db";
import { generateToken, hashToken } from "./tokens";
import crypto from "crypto";
import { refreshTokens } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function createSession(userId: string, userAgent: string) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const familyId = crypto.randomUUID();

  const deviceHash = crypto
    .createHash("sha256")
    .update(userAgent)
    .digest("hex");

  await db
    .delete(refreshTokens)
    .where(
      and(
        eq(refreshTokens.tokenHash, tokenHash),
        eq(refreshTokens.deviceHash, deviceHash),
      ),
    );

  await db.insert(refreshTokens).values({
    userId,
    tokenHash,
    familyId,
    deviceHash,
    isUsed: false,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return { refreshToken: token };
}

export async function refreshSession(oldRawToken: string) {
  const oldHash = hashToken(oldRawToken);

  const [storedToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, oldHash))
    .limit(1);

  if (!storedToken) throw new Error("Invalid Refresh Token");

  if (storedToken.isUsed) {
    console.error(
      `[SECURITY] Reuse detected for Family ID: ${storedToken.familyId}`,
    );

    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.familyId, storedToken.familyId));

    throw new Error("Reuse Detected: Session revoked for security.");
  }

  await db
    .update(refreshTokens)
    .set({ isUsed: true })
    .where(eq(refreshTokens.id, storedToken.id));

  const newToken = generateToken();
  const newTokenHashed = hashToken(newToken);

  await db.insert(refreshTokens).values({
    userId: storedToken.userId,
    tokenHash: newTokenHashed,
    familyId: storedToken.familyId,
    isUsed: false,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return { newRefreshToken: newToken, userId: storedToken.userId };
}

export async function revokeSession(rawToken: string) {
  const tokenHash = hashToken(rawToken);

  const [token] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .limit(1);

  if (token) {
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.familyId, token.familyId));
  }
}
