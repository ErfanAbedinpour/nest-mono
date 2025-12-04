import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { UserRepository } from '../../ports/repository.port';
import { ErrorCode } from '../../../../../libs/_shared/src/error/error-codes';
import { AppException } from '../../../../../libs/_shared/src/error/app.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { password, username } = command;
    try {
      const user = await this.repository.findOneByUsername(username);

      if (user) {
        throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
      }

      return this.repository.create({ password, username });
    } catch (err) {
      if (err instanceof AppException) {
        throw err;
      }
      throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
