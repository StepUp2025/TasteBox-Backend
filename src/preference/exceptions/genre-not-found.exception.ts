import { NotFoundException } from './../../common/exceptions/not-found.exception';

export class GenreNotFoundException extends NotFoundException {
  constructor() {
    super('장르가 발견되지 않았습니다.', 'GENRE_NOT_FOUND');
  }
}
