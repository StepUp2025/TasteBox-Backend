import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('이메일 또는 비밀번호를 확인해주세요.', 'INVALID_CREDENTIALS');
  }
}
