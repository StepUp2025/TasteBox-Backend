import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class InvalidCurrentPasswordException extends UnauthorizedException {
  constructor() {
    super('현재 비밀번호가 올바르지 않습니다.', 'INVALID_CURRENT_PASSWORD');
  }
}
