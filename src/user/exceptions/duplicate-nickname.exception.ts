import { ConflictException } from 'src/common/exceptions/conflict.exception';

export class DuplicateNicknameException extends ConflictException {
  constructor() {
    super('이미 존재하는 닉네임입니다.', 'DUPLICATE_NICKNAME');
  }
}
