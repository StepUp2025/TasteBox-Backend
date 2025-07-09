import { NotFoundException } from '@nestjs/common';

export class ContentNotFoundException extends NotFoundException {
  constructor() {
    super('존재하지 않는 콘텐츠입니다.', 'CONTENT_NOT_FOUND');
  }
}
