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

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @Inject(kakaoOauthConfig.KEY)
    private readonly kakaoConfiguration: ConfigType<typeof kakaoOauthConfig>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    if (!kakaoConfiguration.clientID || !kakaoConfiguration.callbackURL) {
      throw new Error('Kakao OAuth Configuration must be defined');
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
      throw new Error('카카오 프로필에 이메일 정보가 없습니다.');
    }

    const nickname = await this.userService.generateUniqueNickname(
      this.getKakaoNickname(profile, kakaoAccount),
    );

    const user = await this.authService.validateOAuthUser({
      email,
      nickname,
      password: '',
      provider: AuthProvider.KAKAO,
    });

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
