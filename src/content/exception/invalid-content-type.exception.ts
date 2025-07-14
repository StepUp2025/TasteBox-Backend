import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';

export class InvalidContentTypeException extends InternalServerErrorException {
  constructor() {
    super('유효하지 않은 콘텐츠 타입입니다.', 'INVALID_CONTENT_TYPE_KEY');
  }
}
