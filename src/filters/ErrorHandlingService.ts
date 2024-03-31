import { ArgumentsHost, HttpStatus, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export interface CommonError {
  statusCode: number | null;
  message: string | null;
}

interface ResponseBody {
  statusCode: number;
  message: string | null;
}

@Injectable()
export class ErrorHandlingService {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  handleError(error: CommonError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const responseBody: ResponseBody = error.statusCode
      ? {
          statusCode: error.statusCode,
          message: error.message,
        }
      : {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
