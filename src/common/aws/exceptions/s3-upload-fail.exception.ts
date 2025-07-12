import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';

export class S3UploadFailException extends InternalServerErrorException {
  constructor() {
    super('S3 파일 업로드에 실패했습니다.', 'S3_UPLOAD_FAIL');
  }
}
