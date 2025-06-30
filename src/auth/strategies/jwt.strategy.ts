import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { StrategyConfigException } from '../exceptions/strategy-config.exception';
import { AuthJwtPayload } from '../types/auth-jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    if (!jwtConfiguration.secret) {
      throw new StrategyConfigException('JWT', 'secret');
    }

    super({
      jwtFromRequest: (req: Request) => {
        return (req.cookies.accessToken as string) ?? null;
      },
      secretOrKey: jwtConfiguration.secret,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
