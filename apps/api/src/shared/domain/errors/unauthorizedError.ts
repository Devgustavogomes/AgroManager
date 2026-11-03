import { BaseError } from './baseError';

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}
