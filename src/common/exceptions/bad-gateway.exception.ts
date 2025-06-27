import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class BadGatewayException extends BaseException {
  constructor(message: string, error: string) {
    super(message, error, HttpStatus.BAD_GATEWAY);
  }
}
