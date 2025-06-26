import { ConflictException } from 'src/common/exceptions/conflict.exception';

export class DuplicateEmailException extends ConflictException {
  constructor() {
    super('이미 가입된 이메일입니다.', 'DUPLICATE_EMAIL');
  }
}
