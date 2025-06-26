import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DuplicateNicknameException } from 'src/user/exceptions/duplicate-nickname.exception';
import { AlreadyRegisteredAccountException } from 'src/auth/exceptions/already-registered-account.exception';
import { AuthProvider } from './enums/auth-provider.enum';
import { DuplicateEmailException } from './exceptions/duplicate-email.exception';

@Injectable()
export class UserValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async duplicateNickname(nickname: string) {
    const findUser = await this.userRepository.findOneByNickname(nickname);

    if (findUser) {
      throw new DuplicateNicknameException();
    }
  }

  async duplicateEmail(email: string) {
    const findUser = await this.userRepository.findOneByEmail(email);

    if (findUser) {
      if (findUser.provider !== AuthProvider.LOCAL) {
        throw new AlreadyRegisteredAccountException(findUser.provider);
      }
      throw new DuplicateEmailException();
    }
  }
}
