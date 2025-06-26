import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class OAuthAccountLoginException extends UnauthorizedException {
  constructor() {
    super(
      '해당 이메일은 OAuth 계정으로 가입되어 있어, 로컬 로그인을 할 수 없습니다.',
      'OAUTH_ACCOUNT_LOGIN',
    );
  }
}
