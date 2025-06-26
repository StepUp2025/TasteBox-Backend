import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import { StrategyConfigException } from '../exceptions/strategy-config.exception';
import { GoogleEmailNotFoundException } from '../exceptions/google-email-not-found.exception';

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
