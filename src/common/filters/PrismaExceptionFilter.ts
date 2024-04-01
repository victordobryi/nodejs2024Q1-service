import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorHandlingService, CommonError } from './ErrorHandlingService';

const enum PrismaErrors {
  NOT_FOUND = 'P2025',
  CONFLICT = 'P2002',
  BAD_REQUEST = 'P2000',
}

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const commonError: CommonError =
      this.mapPrismaExceptionToCommonError(exception);
    this.errorHandlingService.handleError(commonError, host);
  }

  private mapPrismaExceptionToCommonError(
    exception: PrismaClientKnownRequestError,
  ): CommonError {
    switch (exception.code) {
      case PrismaErrors.NOT_FOUND:
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not found',
        };
      default:
        return { statusCode: null, message: null };
    }
  }
}
