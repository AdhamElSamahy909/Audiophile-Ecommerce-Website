import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { createSession } from "./session";
import { generateAccessToken } from "./tokens";

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

export async function loginUser(
  userId: string,
  role: string,
  userAgent: string,
) {
  const { refreshToken } = await createSession(userId, userAgent);

  const accessToken = await generateAccessToken({ userId });

  return { accessToken, refreshToken };
}
