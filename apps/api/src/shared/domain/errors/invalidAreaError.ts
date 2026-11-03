import { BaseError } from './baseError';

export class InvalidAreaError extends BaseError {
  constructor(message: string = 'Invalid Area') {
    super(422, message);
  }
}
