import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const { message: messageRaw, error: errorRaw } =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as { message: string | string[]; error?: string })
        : { message: exception.message, error: exception.name };

    const message = Array.isArray(messageRaw)
      ? messageRaw.join(', ')
      : messageRaw;
    const error = errorRaw ?? exception.name;

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
