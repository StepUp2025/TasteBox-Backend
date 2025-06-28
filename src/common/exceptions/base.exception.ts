import { HttpException, type HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  public readonly error: string;

  constructor(message: string, error: string, status: HttpStatus) {
    super({ message, error }, status);
    this.error = error;
  }
}
