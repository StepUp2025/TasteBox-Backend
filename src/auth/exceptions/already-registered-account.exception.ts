import { ConflictException } from 'src/common/exceptions/conflict.exception';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';

export class AlreadyRegisteredAccountException extends ConflictException {
  constructor(provider: AuthProvider) {
    const message = `이미 가입된 계정입니다 (${provider})`;
    super(message, 'ALREADY_REGISTERED_ACCOUNT');
  }
}
