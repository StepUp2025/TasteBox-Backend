import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class GoogleEmailNotFoundException extends BadRequestException {
  constructor() {
    super('Google 프로필에 이메일 정보가 없습니다.', 'GOOGLE_EMAIL_NOT_FOUND');
  }
}
