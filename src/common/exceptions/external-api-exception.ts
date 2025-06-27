import { BadGatewayException } from '@nestjs/common';

export class ExternalApiException extends BadGatewayException {
  constructor() {
    super('외부 API 호출 중 오류가 발생했습니다.', 'TMDB_API_ERROR');
  }
}
