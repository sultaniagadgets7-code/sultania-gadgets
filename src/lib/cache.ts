/**
 * Simple in-memory cache for frequently accessed data
 * Reduces Supabase queries by caching results
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data or fetch if expired
 * @param key - Unique cache key
 * @param ttl - Time to live in milliseconds
 * @param fetcher - Function to fetch data if cache miss
 */
export async function getCached<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  
  // Return cached data if still valid
  if (cached && cached.expires > now) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  cache.set(key, {
    data,
    expires: now + ttl,
  });
  
  return data;
}

/**
 * Manually invalidate cache entry
 * @param key - Cache key to invalidate
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

// Clean up expired entries every 5 minutes (server-side only)
if (typeof setInterval !== 'undefined' && typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (value.expires < now) cache.delete(key);
    }
  }, 5 * 60 * 1000);
}

// Cache TTL presets (in milliseconds)
export const CACHE_TTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;
