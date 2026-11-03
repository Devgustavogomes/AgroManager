import { BaseError } from './baseError';

export class NotFoundError extends BaseError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}
