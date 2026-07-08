import {
  EmitterPayload,
  EventEmitterContract,
} from 'src/shared/domain/providers/emitterProvider.contract';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventEmitterProvider implements EventEmitterContract {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  emit<T>(event: EmitterPayload<T>): void {
    this.eventEmitter.emit(event.event, event.data);
  }
}
