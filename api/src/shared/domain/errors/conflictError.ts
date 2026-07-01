import { BaseError } from './baseError';

export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}
