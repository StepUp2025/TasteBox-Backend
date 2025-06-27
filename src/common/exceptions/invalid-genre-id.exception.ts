import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class InvalidGenreIdException extends UnauthorizedException {
  constructor() {
    super('유효하지 않은 장르입니다.', 'INVALID_GENRE_ID');
  }
}
