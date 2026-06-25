import { BadRequestException } from '@nestjs/common';
import { MAX_PROPERTIES_PER_PRODUCER } from '../constants/maxProperties.constant';

export class ValidateMaxProperties {
  static execute(
    propertiesCount: number,
    maxProperties: number = MAX_PROPERTIES_PER_PRODUCER,
  ) {
    if (propertiesCount >= maxProperties) {
      throw new BadRequestException(
        `You have too many properties. The maximum allowed is ${maxProperties}`,
      );
    }
  }
}
