import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

function normalizeErrorResponse(payload: any) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const nestedError = payload.error;
  if (nestedError && typeof nestedError === 'object') {
    const statusCode =
      nestedError.statusCode ||
      nestedError.status ||
      payload.statusCode ||
      payload.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      nestedError.message ||
      payload.message ||
      nestedError.error ||
      'Internal server error';

    const result: any = {
      statusCode: Number(statusCode),
      message,
    };

    if (typeof nestedError.error === 'string') {
      result.error = nestedError.error;
    } else if (typeof payload.error === 'string') {
      result.error = payload.error;
    }

    if (payload.code && !result.error) {
      result.error = payload.code;
    }

    if (payload.details) {
      result.details = payload.details;
    }

    return result;
  }

  return payload;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = {
      statusCode: status,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const rawResponse = exception.getResponse();
      message = normalizeErrorResponse(rawResponse);
    } else {
      const rpcError = exception?.response || exception;

      if (rpcError && typeof rpcError === 'object') {
        const possibleStatus =
          rpcError.statusCode ||
          rpcError.status ||
          rpcError.error?.statusCode ||
          rpcError.error?.status;

        if (possibleStatus && !isNaN(+possibleStatus)) {
          status = +possibleStatus;
        }

        message = normalizeErrorResponse(rpcError);
        message.statusCode = status;
      } else if (exception && exception.message) {
        message = {
          statusCode: status,
          message: exception.message,
        };
      }
    }

    response.status(status).json(message);
  }
}
