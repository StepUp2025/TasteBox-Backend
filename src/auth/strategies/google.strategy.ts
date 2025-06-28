import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Profile, Strategy } from 'passport-google-oauth20';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import type { UserService } from 'src/user/user.service';
import type { AuthService } from '../auth.service';
import googleOauthConfig from '../config/google-oauth.config';
import { GoogleEmailNotFoundException } from '../exceptions/google-email-not-found.exception';
import { StrategyConfigException } from '../exceptions/strategy-config.exception';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    if (!googleConfiguration.clientID) {
      throw new StrategyConfigException('Google', 'clientID');
    }
    if (!googleConfiguration.clientSecret) {
      throw new StrategyConfigException('Google', 'clientSecret');
    }
    if (!googleConfiguration.callbackURL) {
      throw new StrategyConfigException('Google', 'callbackURL');
    }

    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { emails, name } = profile;

    if (!emails || emails.length === 0) {
      throw new GoogleEmailNotFoundException();
    }

    const email = emails[0].value;
    const baseName = name?.givenName;

    const user = await this.authService.validateOAuthUser(
      email,
      AuthProvider.GOOGLE,
      baseName,
    );

    return user;
  }
}
