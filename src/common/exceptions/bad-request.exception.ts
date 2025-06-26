import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.BAD_REQUEST);
  }
}
