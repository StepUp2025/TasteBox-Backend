import { registerAs } from '@nestjs/config';

export default registerAs('kakaoOauth', () => ({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: process.env.KAKAO_CALLBACK_URL,
}));
