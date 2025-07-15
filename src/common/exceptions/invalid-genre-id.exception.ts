import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

export class InvalidGenreIdException extends BadRequestException {
  constructor(invalidIds: number[] = []) {
    const message =
      invalidIds.length > 0
        ? `유효하지 않은 장르 ID가 포함되어 있습니다: ${invalidIds.join(', ')}`
        : '유효하지 않은 장르입니다.';

    super(message, 'INVALID_GENRE_ID');
  }
}
