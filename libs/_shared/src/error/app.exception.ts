import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from './error-codes';

export class AppException extends RpcException {
  constructor(public readonly code: ErrorCode, message?: string) {
    super({ message: message || code, code });
  }
}
