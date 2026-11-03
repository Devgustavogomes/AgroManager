export abstract class BaseError extends Error {
  constructor(
    protected readonly status: number,
    message: string,
  ) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }

  get statusCode(): number {
    return this.status;
  }

  get errorName(): string {
    return this.name;
  }

  get errorMessage(): string {
    return this.message;
  }
}
