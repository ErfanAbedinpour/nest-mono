import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../command/update-user.command';
import { UserRepository } from '../../ports/repository.port';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly repository: UserRepository,
    @Inject('BLOGS_SERVICE') private readonly blogsClient: ClientProxy,
  ) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.repository.findById(command.id.toString());
    if (!user) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    const updatedUser = await this.repository.update(command.id, {
      username: command.username,
      password: command.password,
    });

    if (command.username) {
      this.blogsClient.emit('user.updated', {
        id: updatedUser.id,
        username: updatedUser.username,
      });
    }

    return updatedUser;
  }
}
