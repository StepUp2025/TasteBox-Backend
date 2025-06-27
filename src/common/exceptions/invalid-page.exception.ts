import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class InvalidPageException extends UnauthorizedException {
  constructor() {
    super('유효하지 않은 페이지입니다.', 'INVALID_PAGE');
  }
}
