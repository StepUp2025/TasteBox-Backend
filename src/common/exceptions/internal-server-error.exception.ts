import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
