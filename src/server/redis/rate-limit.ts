import { headers } from "next/headers";
import { redis } from "./client";

async function checkRateLimit(ip: string) {
  const limit = 100;
  const windowMs = 60 * 1000;
  const key = `rate_limit_${ip}`;

  try {
    const currentCount = await redis.incr(key);

    if (currentCount === 1) {
      await redis.expire(key, windowMs / 1000);
    }

    if (currentCount > limit) {
      return { success: false, limit, currentCount };
    }

    return { success: true, limit, currentCount };
  } catch (error) {
    console.error("Redis error: ", error);
    return { success: true };
  }
}

export async function rateLimit() {
  const ip = (await headers()).get("x-forwarded-for") || "anonymous";
  const rateLimit = await checkRateLimit(ip);

  if (!rateLimit.success) {
    throw new Error("Too Many Requests. Please try again in a minute");
  }
}
