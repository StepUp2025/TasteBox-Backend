import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidGenreIdException extends BadRequestException {
  constructor() {
    super('유효하지 않은 장르입니다.', 'INVALID_GENRE_ID');
  }
}
