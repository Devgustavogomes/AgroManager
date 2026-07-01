import { BaseError } from './baseError';

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}
