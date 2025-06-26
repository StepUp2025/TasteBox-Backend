import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import kakaoOauthConfig from '../config/kakao-oauth.config';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import {
  KakaoAccount,
  KakaoProfileResponse,
} from '../interfaces/kakao.interface';
import { StrategyConfigException } from '../exceptions/strategy-config.exception';
import { KakaoEmailNotFoundException } from '../exceptions/kakao-email-not-found.exception';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @Inject(kakaoOauthConfig.KEY)
    private readonly kakaoConfiguration: ConfigType<typeof kakaoOauthConfig>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    if (!kakaoConfiguration.clientID) {
      throw new StrategyConfigException('Kakao', 'clientID');
    }
    if (!kakaoConfiguration.callbackURL) {
      throw new StrategyConfigException('Kakao', 'callbackURL');
    }

    super({
      clientID: kakaoConfiguration.clientID,
      callbackURL: kakaoConfiguration.callbackURL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);
    const response = profile._json as KakaoProfileResponse;
    const kakaoAccount = response.kakao_account;
    const email = kakaoAccount.email;

    if (!email) {
      throw new KakaoEmailNotFoundException();
    }

    const baseName = this.getKakaoNickname(profile, kakaoAccount);

    const user = await this.authService.validateOAuthUser(
      email,
      AuthProvider.KAKAO,
      baseName,
    );

    return user;
  }

  private getKakaoNickname(
    profile: Profile,
    kakaoAccount: KakaoAccount,
  ): string {
    return (
      kakaoAccount?.profile?.nickname ||
      profile.username ||
      profile.displayName ||
      ''
    );
  }
}
