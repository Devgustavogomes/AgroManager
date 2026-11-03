import { IdGeneratorContract } from '../../domain/providers/idGenerator.contract';
import { v7 as uuidv7 } from 'uuid';

export class UuidV7Generator implements IdGeneratorContract {
  generate(): string {
    return uuidv7();
  }
}
