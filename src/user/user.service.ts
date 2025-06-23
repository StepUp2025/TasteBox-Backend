import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidator: UserValidator,
  ) {}

  async findUserById(id: number): Promise<UserDto> {
    const findUser = await this.userRepository.findOneById(id);

    if (!findUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UserDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    const findUser = await this.userRepository.findOneByEmail(email);

    if (!findUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UserDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, nickname } = createUserDto;

    // 이메일 검증
    await this.userValidator.duplicateEmail(email);

    // 닉네임 검증
    await this.userValidator.duplicateNickname(nickname);

    // 유저 생성
    return await this.userRepository.createUser(createUserDto);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const { nickname } = updateUserDto;

    // 닉네임 검증
    if (nickname) {
      await this.userValidator.duplicateNickname(nickname);
    }

    await this.userRepository.updateUser(userId, updateUserDto);
  }

  async generateUniqueNickname(base?: string): Promise<string> {
    let nickname = this.generateRandomNickname(base);
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // 무한 루프 방지용 최대 시도 횟수

    while (await this.userRepository.findOneByNickname(nickname)) {
      nickname = this.generateRandomNickname(base);
      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        throw new Error('고유한 닉네임을 생성하지 못했습니다.');
      }
    }
    return nickname;
  }

  private generateRandomNickname(base?: string): string {
    const randomSuffix = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자열
    return base ? `${base}_${randomSuffix}` : `user_${randomSuffix}`;
  }
}
