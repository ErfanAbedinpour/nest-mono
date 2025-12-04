import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '../command/login.user.command';
import { ValidateSessionQuery } from '../query/validate-session.query';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  login(username: string, password: string) {
    return this.commandBus.execute(new LoginCommand(username, password));
  }

  validateSession(sessionId: string) {
    return this.queryBus.execute(new ValidateSessionQuery(sessionId));
  }
}
