import { MAX_PROPERTIES_PER_PRODUCER } from '../constants/maxProperties.constant';
import { ConflictError } from 'src/shared/domain/errors/conflictError';

export class ValidateMaxProperties {
  static execute(
    propertiesCount: number,
    maxProperties: number = MAX_PROPERTIES_PER_PRODUCER,
  ) {
    if (propertiesCount >= maxProperties) {
      throw new ConflictError(
        `You have too many properties. The maximum allowed is ${maxProperties}`,
      );
    }
  }
}
