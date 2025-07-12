import { NotFoundException } from 'src/common/exceptions/not-found.exception';

export class CollectionNotFoundException extends NotFoundException {
  constructor() {
    super('해당 컬렉션은 존재하지 않습니다.', 'COLLECTION_NOT_FOUND');
  }
}
