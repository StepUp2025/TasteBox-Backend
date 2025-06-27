import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class ContentNotFoundException extends BadRequestException {
  constructor() {
    super('존재하지 않는 콘텐츠입니다.', 'CONTENT_NOT_FOUND');
  }
}
