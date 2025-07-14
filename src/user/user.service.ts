import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AlreadyRegisteredAccountException } from 'src/auth/exceptions/already-registered-account.exception';
import { S3Service } from 'src/common/aws/s3.service';
import { FileDomain } from 'src/common/enums/s3.enum';
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
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

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

  async createLocalUser(
    dto: CreateUserRequestDto,
    image?: Express.Multer.File,
  ) {
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

    const newUser = await this.userRepository.createUser(dto);

    if (image) {
      const imageUrl = await this.s3Service.uploadFile({
        file: {
          ...image,
          /*
            Multer 라이브러리가 latin1 인코딩을 사용하기 때문에 파일명이 한글인 경우 인코딩에 문제가 생깁니다.
            Buffer.from(originalname, 'latin1').toString('utf8')로 깨진 파일명을 원래의 UTF-8 파일명으로 복원해주는 과정을 거쳤습니다.
          **/
          originalname: Buffer.from(image.originalname, 'latin1').toString(
            'utf8',
          ),
        },
        domain: FileDomain.USERS,
        userId: newUser.id,
      });
      await this.userRepository.updateUserImage(newUser.id, imageUrl);
    }
  }

  async updateUserProfile(
    userId: number,
    dto: UpdateUserProfileRequestDto,
    image?: Express.Multer.File,
  ) {
    const { nickname } = dto;

    // 닉네임 중복 검증
    if (nickname && (await this.isNicknameDuplicate(nickname, userId))) {
      throw new DuplicateNicknameException();
    }

    const imageUrl = image
      ? await this.s3Service.uploadFile({
          file: {
            ...image,
            /*
              Multer 라이브러리가 latin1 인코딩을 사용하기 때문에 파일명이 한글인 경우 인코딩에 문제가 생깁니다.
              Buffer.from(originalname, 'latin1').toString('utf8')로 깨진 파일명을 원래의 UTF-8 파일명으로 복원해주는 과정을 거쳤습니다.
            **/
            originalname: Buffer.from(image.originalname, 'latin1').toString(
              'utf8',
            ),
          },
          domain: FileDomain.USERS,
          userId,
        })
      : null;

    await this.userRepository.updateUserProfile(userId, dto, imageUrl);
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

  async isNicknameDuplicate(
    nickname: string,
    userId?: number,
  ): Promise<boolean> {
    const findUser = await this.userRepository.findOneByNickname(nickname);
    if (!findUser) return false;

    // userId가 주어졌을 때, 본인 닉네임과 비교하게 된 경우는 무시하도록 false
    if (userId && findUser.id === userId) return false;

    return true;
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
