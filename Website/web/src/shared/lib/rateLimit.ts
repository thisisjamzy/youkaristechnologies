/**
 * In-memory sliding-window limiter: `limit` hits per `windowMs` per key. Per server
 * instance only, which is enough to slow down a runaway script on a small site.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();
  return {
    /** Records a hit; false when the key is over the limit. */
    allow(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}
