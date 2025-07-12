import { NotFoundException } from 'src/common/exceptions/not-found.exception';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('유저 정보가 없습니다.', 'USER_NOT_FOUND');
  }
}
