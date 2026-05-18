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
  // x-real-ip is set by the trusted reverse proxy (Nginx / Vercel) to the
  // actual client IP and cannot be prepended by the client. Prefer it.
  // x-forwarded-for fallback takes the last entry — the rightmost value is
  // appended by the nearest trusted proxy, not the client.
  return (
    hdrs.get("x-real-ip") ??
    hdrs.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
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
