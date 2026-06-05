export class InvalidAreaError extends Error {
  private status: number;
  constructor(message: string) {
    super(message);

    this.status = 422;
  }

  get getStatus() {
    return this.status;
  }
}
