import { BadRequestException } from '@nestjs/common';

export class InvalidPageException extends BadRequestException {
  constructor() {
    super('유효하지 않은 페이지입니다.', 'INVALID_PAGE');
  }
}
