import { NextRequest } from "next/server";

// Simple in-memory sliding-window rate limiter.
// For multi-instance / serverless production, back this with Redis
// (see REDIS_URL); the interface stays the same.
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(
  req: NextRequest,
  opts: { key: string; limit: number; windowMs: number }
): { ok: boolean; remaining: number; resetAt: number } {
  const ip = getClientIp(req);
  const id = `${opts.key}:${ip}`;
  const now = Date.now();
  const bucket = store.get(id);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + opts.windowMs;
    store.set(id, { count: 1, resetAt });
    return { ok: true, remaining: opts.limit - 1, resetAt };
  }

  bucket.count += 1;
  const ok = bucket.count <= opts.limit;
  return { ok, remaining: Math.max(0, opts.limit - bucket.count), resetAt: bucket.resetAt };
}

// Periodic cleanup to avoid unbounded growth.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt < now) store.delete(key);
    }
  }, 60_000);
  // Don't keep the process alive solely for cleanup.
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}
