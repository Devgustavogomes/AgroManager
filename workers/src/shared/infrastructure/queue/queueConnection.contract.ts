export abstract class QueueConnectionContract<T = unknown> {
  abstract getClient(): T;
}
