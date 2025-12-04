import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const sessionId = authHeader.replace('Bearer ', '');

    try {
      const session = await firstValueFrom(
        this.usersClient.send({ cmd: 'validate_session' }, { sessionId }),
      );

      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

      request.user = session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
