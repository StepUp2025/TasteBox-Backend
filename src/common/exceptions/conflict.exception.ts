import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ConflictException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.CONFLICT);
  }
}
