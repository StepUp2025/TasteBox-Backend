import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import Redis from 'ioredis';
import { CreateUserRequestDto } from 'src/user/dto/request/create-user-request.dto';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { UserNotFoundException } from '../user/exceptions/user-not-found.exception';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UpdatePasswordRequestDto } from './dto/request/update-password-request.dto';
import { TokenResponse } from './dto/response/token-response.interface';
import { AlreadyRegisteredAccountException } from './exceptions/already-registered-account.exception';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { InvalidCurrentPasswordException } from './exceptions/invalid-current-password.exception';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';
import { OAuthAccountLoginException } from './exceptions/oauth-account-login.exception';
import { OAuthAccountPasswordChangeException } from './exceptions/oauth-account-password-change.exception';
import { PasswordMismatchException } from './exceptions/password-mismatch.exception';
import { AuthJwtPayload } from './types/auth-jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    // Argon2로 refreshToken 해싱
    const hashedRefreshToken = await argon2.hash(refreshToken);

    const key = this.getRefreshTokenKey(userId);

    await this.redis.setex(
      key,
      Number(process.env.REDIS_REFRESH_EXPIRE_SECONDS),
      hashedRefreshToken,
    );

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    const key = this.getRefreshTokenKey(userId);

    await this.redis.del(key);
  }

  async updatePassword(userId: number, dto: UpdatePasswordRequestDto) {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.password) {
      throw new OAuthAccountPasswordChangeException();
    }

    // 1. 현재 비밀번호 검증
    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new InvalidCurrentPasswordException();
    }

    // 2. 새 비밀번호 일치 검증
    if (dto.newPassword !== dto.newPasswordConfirm) {
      throw new PasswordMismatchException();
    }

    // 3. 새 비밀번호 업데이트
    user.password = dto.newPassword;
    await this.userRepository.save(user);
  }

  // Access Token 갱신과 동시에 RefreshToken도 갱신 (RTR - Refresh Token Rotation)
  async refreshToken(userId: number): Promise<TokenResponse> {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    const key = this.getRefreshTokenKey(userId);

    await this.redis.setex(
      key,
      Number(process.env.REDIS_REFRESH_EXPIRE_SECONDS),
      hashedRefreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number): Promise<TokenResponse> {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    const key = this.getRefreshTokenKey(userId);
    await this.redis.setex(
      key,
      Number(process.env.REDIS_REFRESH_EXPIRE_SECONDS),
      hashedRefreshToken,
    );
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<{ id: number }> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.password) {
      throw new OAuthAccountLoginException();
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return {
      id: user.id,
    };
  }

  async validateOAuthUser(
    email: string,
    currentProvider: AuthProvider,
    baseName: string | undefined,
  ) {
    // OAuth 계정의 Email로 가입된 회원 존재하는지 확인
    const user = await this.userRepository.findOneByEmail(email);

    // 이미 해당 이메일로 가입된 회원인 경우
    if (user) {
      // 현재 로그인 시도하는 OAuth provider와 기존 가입 provider가 다를 경우 예외 발생
      if (user.provider !== currentProvider) {
        throw new AlreadyRegisteredAccountException(user.provider);
      }
      // provider까지 일치하면 회원 정보를 전달 (이후에는 콜백을 통해 쿠키 설정 후 프론트로 리다이렉트)
      return user;
    }

    // 닉네임 생성
    const nickname = await this.userService.generateUniqueNickname(baseName);

    // DTO 생성
    const dto: CreateUserRequestDto = {
      email,
      password: '',
      nickname,
      provider: currentProvider,
    };

    // 회원 생성 및 저장
    return await this.userRepository.createUser(dto);
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ id: number }> {
    const hashedRefreshToken = await this.getHashedRefreshToken(userId);

    if (!hashedRefreshToken) {
      throw new InvalidRefreshTokenException();
    }

    const isRefreshTokenValid = await argon2.verify(
      hashedRefreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new InvalidRefreshTokenException();
    }

    return {
      id: userId,
    };
  }

  async getHashedRefreshToken(userId: number): Promise<string | null> {
    const key = this.getRefreshTokenKey(userId);
    return await this.redis.get(key);
  }

  private getRefreshTokenKey(userId: number): string {
    return `userId:${userId}:refreshToken`;
  }
}
