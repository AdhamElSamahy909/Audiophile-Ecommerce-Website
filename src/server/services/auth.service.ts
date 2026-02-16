import { db } from "../db";
import crypto from "crypto";
import { refreshTokens, users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { SignJWT } from "jose";
import argon2 from "argon2";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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

export async function signup(username: string, plainPassword: string) {
  const exitingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (exitingUser) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await argon2.hash(plainPassword);

  const [newUser] = await db
    .insert(users)
    .values({ username, passwordhash: hashedPassword })
    .returning();

  return newUser;
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

export async function loginUser(
  userId: string,
  role: string,
  userAgent: string,
) {
  const { refreshToken } = await createSession(userId, userAgent);

  const accessToken = await generateAccessToken({ userId });

  return { accessToken, refreshToken };
}
