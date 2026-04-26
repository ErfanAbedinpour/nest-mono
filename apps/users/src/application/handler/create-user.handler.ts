import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { UserRepository } from '../../ports/repository.port';
import { ErrorCode } from '@app/_shared/error/error-codes';
import { AppException } from '@app/_shared/error/app.exception';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private repository: UserRepository,
    @Inject('BLOGS_SERVICE') private readonly blogsClient: ClientProxy,
    @Inject('COMMENTS_SERVICE') private readonly commentsClient: ClientProxy,
  ) {}

  async execute(command: CreateUserCommand) {
    const { password, username } = command;
    try {
      const user = await this.repository.findOneByUsername(username);

      if (user) {
        throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
      }

      const created = await this.repository.create({ password, username });
      this.blogsClient.emit('user.created', {
        id: created.id,
        username: created.username,
      });
      this.commentsClient.emit('user.created', {
        id: created.id,
        username: created.username,
      });
      return created;
    } catch (err) {
      if (err instanceof AppException) {
        throw err;
      }
      throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
