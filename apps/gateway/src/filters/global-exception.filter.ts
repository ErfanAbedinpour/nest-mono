import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

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
      message = exception.getResponse();
    } else {
      // Check if exception is the error object itself (from RpcException)
      const rpcError = exception?.response || exception;

      if (rpcError && typeof rpcError === 'object') {
        // Extract status code
        const possibleStatus =
          rpcError.statusCode ||
          rpcError.status ||
          rpcError.error?.statusCode ||
          rpcError.error?.status;

        if (possibleStatus && !isNaN(+possibleStatus)) {
          status = +possibleStatus;
        }

        // Use the error object as the response body
        message = rpcError;

        // Ensure statusCode is correct in the body
        if (message && typeof message === 'object') {
          message.statusCode = status;
        }
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
