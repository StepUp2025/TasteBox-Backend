import { ConflictException } from 'src/common/exceptions/conflict.exception';

export class AlreadyRegisteredAccountException extends ConflictException {
  constructor(provider: string) {
    const message = `이미 가입된 계정입니다 (${provider})`;
    super(message, 'ALREADY_REGISTERED_ACCOUNT');
  }
}
