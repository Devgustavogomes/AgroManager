export interface EmitterPayload<T> {
  event: string;
  producerId: string;
  data: T;
}

export abstract class EventEmitterContract {
  abstract emit<T>(payload: EmitterPayload<T>): void;
}
