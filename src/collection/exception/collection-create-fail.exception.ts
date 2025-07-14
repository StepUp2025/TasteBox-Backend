import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';

export class CollectionCreateFailException extends InternalServerErrorException {
  constructor() {
    super('컬렉션 생성에 실패했습니다.', 'COLLECTION_CREATE_FAIL');
  }
}
