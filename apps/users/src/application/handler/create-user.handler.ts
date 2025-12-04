import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { UserRepository } from '../../ports/repository.port';
import { HandlerException } from '../exceptions/handler.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { password, username } = command;
    try {
      const user = await this.repository.findOneByUsername(username);

      if (user) {
        throw new HandlerException('User already exists');
      }

      await this.repository.create({ password, username });
      return;
    } catch (err) {
      if (err instanceof HandlerException) {
        throw err;
      }
      throw new HandlerException('Failed to create user');
    }
  }
}
