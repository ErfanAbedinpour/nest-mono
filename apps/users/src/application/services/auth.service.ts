import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../command/login.user.command';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly commandBus: CommandBus,
  ) {}

  login(username: string, password: string) {
    return this.commandBus.execute(new LoginCommand(username, password));
  }
}
