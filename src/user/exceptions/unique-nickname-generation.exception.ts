import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';

export class UniqueNicknameGenerationException extends InternalServerErrorException {
  constructor() {
    super(
      '고유한 닉네임을 생성하지 못했습니다',
      'UNIQUE_NICKNAME_GENERATION_FAILED',
    );
  }
}
