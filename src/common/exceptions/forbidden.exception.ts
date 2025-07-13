import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(
    message: string = '권한이 없습니다.',
    error: string = 'FORBIDDEN',
  ) {
    super(message, error, HttpStatus.FORBIDDEN);
  }
}
