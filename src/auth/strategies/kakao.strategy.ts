import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import kakaoOauthConfig from '../config/kakao-oauth.config';
import { KakaoEmailNotFoundException } from '../exceptions/kakao-email-not-found.exception';
import { StrategyConfigException } from '../exceptions/strategy-config.exception';
import {
  KakaoAccount,
  KakaoProfileResponse,
} from '../interfaces/kakao.interface';

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

  async validate(
    _accessToken: string,
    _refreshTokenn: string,
    profile: Profile,
  ) {
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
