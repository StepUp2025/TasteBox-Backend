import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';

export class CollectionDeleteFailException extends InternalServerErrorException {
  constructor() {
    super('컬렉션 삭제에 실패했습니다.', 'COLLECTION_DELETE_FAIL');
  }
}
