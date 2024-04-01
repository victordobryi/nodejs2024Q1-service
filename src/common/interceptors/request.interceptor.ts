import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { EOL } from 'node:os';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const now = Date.now();
    const requestLog = `Request: 
          - url: ${request.url}(${request.method}),
          - query params ${JSON.stringify(request.query)}, 
          - body: ${JSON.stringify(request.body)}`;

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - now;
        const responseLog = `Response: 
          - status code: ${response.statusCode}, 
          - body: ${JSON.stringify(data)}`;
        this.logger.debug(
          `${duration}ms${EOL}\t${requestLog}${EOL}\t${responseLog}`,
          RequestInterceptor.name,
        );
      }),
    );
  }
}
