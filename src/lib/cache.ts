/**
 * Cache utilities — G-will Chijioke (https://gwillchijioke.com)
 */

/**
 * cache.ts — Build-time and runtime cache with stale-while-revalidate
 */

const cache = new Map<string, { data: any; ts: number }>();
const TTL = parseInt(import.meta.env.CACHE_TTL || '300000', 10); // 5 min default

export async function cached<T>(key: string, fn: () => Promise<T>, ttl = TTL): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) return hit.data;
  const data = await fn();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

export function invalidate(keyPattern: RegExp): void {
  for (const key of cache.keys()) {
    if (keyPattern.test(key)) cache.delete(key);
  }
}

export function clear(): void {
  cache.clear();
}
