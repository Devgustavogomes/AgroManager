export abstract class CacheContract {
  abstract set(key: string, value: string, ttl?: number): Promise<void>;
  abstract get(key: string): Promise<string | null>;
  abstract del(key: string): Promise<void>;
}
