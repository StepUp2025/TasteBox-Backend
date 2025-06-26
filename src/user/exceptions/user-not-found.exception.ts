import { NotFoundException } from 'src/common/exceptions/not-found.exception';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('해당 이메일로 가입된 유저가 없습니다.', 'USER_NOT_FOUND');
  }
}
