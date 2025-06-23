import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<
      typeof refreshJwtConfig
    >,
    private readonly authService: AuthService,
  ) {
    if (!refreshJwtConfiguration.secret) {
      throw new Error('REFRESH_JWT_SECRET must be defined');
    }

    super({
      jwtFromRequest: (req: Request) => {
        return (req.cookies.refreshToken as string) ?? null;
      },
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookie');
    }

    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
