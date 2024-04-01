import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CommonError, ErrorHandlingService } from './ErrorHandlingService';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const commonError: CommonError = {
      statusCode: exception?.status || null,
      message: exception?.message || null,
    };
    this.errorHandlingService.handleError(commonError, host);
  }
}
