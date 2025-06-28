import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.CONFLICT);
  }
}
