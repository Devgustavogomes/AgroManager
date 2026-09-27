export abstract class CacheConnectionContract<T = unknown> {
  abstract getClient(): T;
}
