import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class KakaoEmailNotFoundException extends BadRequestException {
  constructor() {
    super('카카오 프로필에 이메일 정보가 없습니다.', 'KAKAO_EMAIL_NOT_FOUND');
  }
}
