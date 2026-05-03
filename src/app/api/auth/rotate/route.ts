import { db } from "@/server/db";
import { refreshTokens, users } from "@/server/db/schema";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { SignJWT } from "jose";
import { v4 } from "uuid";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET,
);

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const rawRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!rawRefreshToken) {
        return NextResponse.json({error: "No refresh token found"}, {status: 401});
    }

    try {
        const incomingTokenHash = createHash("sha256").update(rawRefreshToken).digest("hex");

        const [dbResult] = await db
        .select({
            token: refreshTokens,
            user: {id: users.id, username: users.username},
        })
        .from(refreshTokens)
        .innerJoin(users, eq(users.id, refreshTokens.userId))
        .where(eq(refreshTokens.tokenHash, incomingTokenHash))
        .limit(1);

        if (!dbResult) {
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            return NextResponse.json({error: "Invalid Refresh Token"}, {status: 401});
        }

        const {token: dbToken, user } = dbResult;

        if (dbToken.isUsed) {
            // Wipe all sessions
            await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.userId, dbToken.userId));

            cookieStore.delete('accessToken');
            cookieStore.delete("refreshToken");
            return NextResponse.json({error: "Security breach detected. Please log in again."}, {status: 403});
        }

        if (new Date() > dbToken.expiresAt) {
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            return NextResponse.json({error: "Refresh Token expired"}, {status: 401});
        }

        await db
        .update(refreshTokens)
        .set({isUsed: true})
        .where(eq(refreshTokens.tokenHash, incomingTokenHash));

        const newRawRefreshToken = crypto.randomBytes(32).toString("hex");
        const newTokenHash = crypto.createHash("sha256").update(newRawRefreshToken).digest("hex");

        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);

        await db.insert(refreshTokens).values({
            userId: user.id,
            familyId: dbToken.familyId,
            tokenHash: newTokenHash,
            expiresAt: newExpiresAt
        });

        const newAccessToken = await new SignJWT({
            userId: user.id,
            jti: v4()
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("15m")
            .sign(ACCESS_TOKEN_SECRET);

        cookieStore.set("refreshToken", newRawRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
        });

        cookieStore.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        const url = new URL(request.url);
        const redirectTo = url.searchParams.get("redirect") || "/";

        return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
        console.error("Refresh token error: ", error);
        return NextResponse.redirect(new URL("/500", request.url));
    }
}