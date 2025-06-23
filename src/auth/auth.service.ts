import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';
import * as argon2 from 'argon2';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { TokenResponse } from './dto/response/token-response.interface';
import { CreateUserRequestDto } from 'src/user/dto/request/create-user-request.dto';
import { UserService } from 'src/user/user.service';

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

  async validateUser(email: string, password: string): Promise<{ id: number }> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저 정보입니다.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    return {
      id: user.id,
    };
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ id: number }> {
    const hashedRefreshToken = await this.getHashedRefreshToken(userId);

    if (!hashedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const isRefreshTokenValid = await argon2.verify(
      hashedRefreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return {
      id: userId,
    };
  }

  async validateGoogleUser(googleUser: CreateUserRequestDto) {
    const user = await this.userRepository.findOneByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.createUser(googleUser);
  }

  async getHashedRefreshToken(userId: number): Promise<string | null> {
    const key = this.getRefreshTokenKey(userId);
    return await this.redis.get(key);
  }

  private getRefreshTokenKey(userId: number): string {
    return `userId:${userId}:refreshToken`;
  }
}
