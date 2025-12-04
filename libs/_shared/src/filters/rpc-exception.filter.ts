import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { AppException } from '../error/app.exception';
import { ErrorCode, ErrorCodeMap } from '../error/error-codes';

@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const errorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };

    if (exception instanceof AppException) {
      const errorObj = exception.getError() as any;
      const code = errorObj.code as ErrorCode;
      errorResponse.statusCode =
        ErrorCodeMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse.message = errorObj.message;
      errorResponse.error = code;
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      errorResponse.statusCode = status;
      if (typeof response === 'object' && response !== null) {
        Object.assign(errorResponse, response);
      } else {
        errorResponse.message = exception.message;
      }
    } else if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object' && error !== null) {
        Object.assign(errorResponse, error);
      } else {
        errorResponse.message = exception.message;
      }
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
    }

    return throwError(() => new RpcException(errorResponse));
  }
}
