import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.NOT_FOUND);
  }
}
