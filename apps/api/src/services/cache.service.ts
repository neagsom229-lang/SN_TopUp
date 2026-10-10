class CacheService {
  private store = new Map<string, { value: any; expiry: number }>();

  set(key: string, value: any, ttlSeconds: number = 60) {
    this.store.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  }

  get(key: string): any {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  del(key: string) {
    this.store.delete(key);
  }
}

export const cacheService = new CacheService();
