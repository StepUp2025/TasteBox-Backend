import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AlreadyRegisteredAccountException } from 'src/auth/exceptions/already-registered-account.exception';
import { generateRandomNickname } from 'src/common/utils/nickname.util';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { User } from 'src/user/user.entity';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { DuplicateNicknameException } from './exceptions/duplicate-nickname.exception';
import { UniqueNicknameGenerationException } from './exceptions/unique-nickname-generation.exception';
import { EmailDuplicateResult } from './types/user.types';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.getOrThrowById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.getOrThrowByEmail(email);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async createLocalUser(dto: CreateUserRequestDto) {
    const { email, nickname } = dto;

    // 이메일 중복 검증
    const result: EmailDuplicateResult = await this.isEmailDuplicate(email);

    if (result.isDuplicate) {
      // Local로 회원가입 시도하지만, 이미 Local 또는 OAuth로 같은 이메일로 가입된 경우에 예외 발생
      throw new AlreadyRegisteredAccountException(result.provider);
    }

    // 닉네임 중복 검증
    if (await this.isNicknameDuplicate(nickname)) {
      throw new DuplicateNicknameException();
    }

    // 회원 생성
    return await this.userRepository.createUser(dto);
  }

  async updateUserProfile(userId: number, dto: UpdateUserProfileRequestDto) {
    const { nickname } = dto;

    // 닉네임 중복 검증
    if (nickname && (await this.isNicknameDuplicate(nickname))) {
      throw new DuplicateNicknameException();
    }

    await this.userRepository.updateUserProfile(userId, dto);
  }

  async generateUniqueNickname(base?: string): Promise<string> {
    let nickname = generateRandomNickname(base);
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // 무한 루프 방지용 최대 시도 횟수

    while (await this.isNicknameDuplicate(nickname)) {
      nickname = generateRandomNickname(base);
      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        throw new UniqueNicknameGenerationException();
      }
    }
    return nickname;
  }

  async isNicknameDuplicate(nickname: string): Promise<boolean> {
    const findUser = await this.userRepository.findOneByNickname(nickname);
    return !!findUser;
  }

  async isEmailDuplicate(email: string): Promise<EmailDuplicateResult> {
    const findUser = await this.userRepository.findOneByEmail(email);
    if (!findUser) return { isDuplicate: false };
    return { isDuplicate: true, provider: findUser.provider };
  }

  async getOrThrowById(id: number): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }
  async getOrThrowByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
