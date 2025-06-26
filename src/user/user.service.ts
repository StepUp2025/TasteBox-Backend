import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { plainToInstance } from 'class-transformer';
import { generateRandomNickname } from 'src/common/utils/nickname.util';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { UniqueNicknameGenerationException } from './exceptions/unique-nickname-generation.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidator: UserValidator,
  ) {}

  async findUserById(id: number): Promise<UserResponseDto> {
    const findUser = await this.userRepository.findOneById(id);

    if (!findUser) {
      throw new UserNotFoundException();
    }

    return plainToInstance(UserResponseDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<UserResponseDto> {
    const findUser = await this.userRepository.findOneByEmail(email);

    if (!findUser) {
      throw new UserNotFoundException();
    }

    return plainToInstance(UserResponseDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(dto: CreateUserRequestDto) {
    const { email, nickname } = dto;

    // 이메일 검증
    await this.userValidator.duplicateEmail(email);

    // 닉네임 검증
    await this.userValidator.duplicateNickname(nickname);

    // 유저 생성
    return await this.userRepository.createUser(dto);
  }

  async updateUserProfile(userId: number, dto: UpdateUserProfileRequestDto) {
    const { nickname } = dto;

    // 닉네임 검증
    if (nickname) {
      await this.userValidator.duplicateNickname(nickname);
    }

    await this.userRepository.updateUserProfile(userId, dto);
  }

  async generateUniqueNickname(base?: string): Promise<string> {
    let nickname = generateRandomNickname(base);
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // 무한 루프 방지용 최대 시도 횟수

    while (await this.userRepository.findOneByNickname(nickname)) {
      nickname = generateRandomNickname(base);
      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        throw new UniqueNicknameGenerationException();
      }
    }
    return nickname;
  }
}
