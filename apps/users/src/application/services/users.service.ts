import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { HandlerException } from '../exceptions/handler.exception';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}

  async create(username: string, password: string): Promise<void> {
    try {
      return this.commandBus.execute(new CreateUserCommand(username, password));
    } catch (err) {
      if (err instanceof HandlerException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(`Failed to create user`);
    }
  }
}
