import { buildTemplatedApiExceptionDecorator } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export const CustomApiException = buildTemplatedApiExceptionDecorator({
  statusCode: '$status',
  message: '$description',
  error: '$error',
  timestamp: '2025-06-26T12:00:00.000Z',
});
