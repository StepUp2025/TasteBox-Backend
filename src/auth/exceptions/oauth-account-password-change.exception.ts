import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class OAuthAccountPasswordChangeException extends UnauthorizedException {
  constructor() {
    super(
      'OAuth 계정은 비밀번호 변경이 불가능합니다.',
      'OAUTH_ACCOUNT_PASSWORD_CHANGE',
    );
  }
}
