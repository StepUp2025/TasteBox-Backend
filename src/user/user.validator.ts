import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserValidator {
  constructor(private readonly userRepository: UserRepository) {}

  async duplicateNickname(nickname: string) {
    const findUser = await this.userRepository.findOneByNickname(nickname);

    if (findUser) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
  }

  async duplicateEmail(email: string) {
    const findUser = await this.userRepository.findOneByEmail(email);

    if (findUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
  }
}
