import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InternalServerErrorException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
