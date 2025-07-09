import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(message: string | Record<string, string[]>, error: string) {
    super(message, error, HttpStatus.BAD_REQUEST);
  }
}
