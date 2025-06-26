import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class PasswordMismatchException extends BadRequestException {
  constructor() {
    super('새 비밀번호가 서로 일치하지 않습니다', 'PASSWORD_MISMATCH');
  }
}
