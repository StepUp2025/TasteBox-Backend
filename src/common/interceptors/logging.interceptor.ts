import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }
    return next.handle();
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const correlationKey = uuidv4();
    const userId = request.user?.userId;

    let routePattern = url;
    if (request.route?.path) {
      routePattern = request.baseUrl
        ? request.baseUrl + request.route.path
        : request.route.path;
    }

    this.logger.log(
      `[${correlationKey}] ${method} ${routePattern} ${userId} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name}`,
    );

    const now = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        const diff = process.hrtime(now);
        const durationInSeconds = diff[0] + diff[1] / 1e9;

        this.httpRequestDuration
          .labels(
            method,
            routePattern,
            statusCode ? statusCode.toString() : 'unknown',
          )
          .observe(durationInSeconds);

        this.logger.log(
          `[${correlationKey}] ${method} ${routePattern} ${statusCode} ${contentLength}: ${Math.round(durationInSeconds * 1000)}ms`,
        );
      }),
    );
  }
}
