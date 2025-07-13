import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';

export class S3DeleteFailException extends InternalServerErrorException {
  constructor() {
    super('S3 파일 삭제에 실패했습니다.', 'S3_DELETE_FAIL');
  }
}
