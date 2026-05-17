import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Keyed by IP. Points = max requests per window.
const limiters: Record<string, RateLimiterMemory> = {
  // Bookmark mutations
  write: new RateLimiterMemory({ points: 20, duration: 60 }),
  // Schedule sync
  schedule: new RateLimiterMemory({ points: 5, duration: 60 }),
  // Feedback (stricter)
  feedback: new RateLimiterMemory({ points: 5, duration: 60 }),
};

async function getIp(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0].trim() ??
    hdrs.get("x-real-ip") ??
    "unknown"
  );
}

export async function rateLimit(
  type: keyof typeof limiters,
): Promise<NextResponse | null> {
  const ip = await getIp();
  try {
    await limiters[type].consume(ip);
    return null;
  } catch {
    return NextResponse.json(
      { success: false, message: "Too many requests, please slow down." },
      { status: 429 },
    );
  }
}
