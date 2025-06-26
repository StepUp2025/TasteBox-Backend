import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('올바르지 않은 Refresh Token 입니다.', 'INVALID_REFRESH_TOKEN');
  }
}
