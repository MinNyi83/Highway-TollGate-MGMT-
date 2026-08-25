interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 60000; // 1 minute

  constructor(defaultTTL?: number) {
    if (defaultTTL) this.defaultTTL = defaultTTL;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.store.set(key, { data, expiry });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  size(): number {
    return this.store.size;
  }
}

export const cache = new MemoryCache(60000);

export function cached<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cachedData = cache.get<T>(key);
  if (cachedData !== null) {
    return Promise.resolve(cachedData);
  }
  return fn().then((data) => {
    cache.set(key, data, ttl);
    return data;
  });
}

export function invalidateCache(pattern: string): void {
  cache.clearPattern(pattern);
}
