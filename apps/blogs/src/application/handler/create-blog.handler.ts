import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../command/create-blog.command';
import { BlogRepository } from '../../ports/repository.port';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly repository: BlogRepository,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async execute(command: CreateBlogCommand) {
    let user;
    try {
      user = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'find_one_user' },
          { id: command.userId.toString() },
        ),
      );
    } catch (error) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    if (!user) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    const blog = await this.repository.create({
      title: command.title,
      description: command.description,
      content: command.content,
      userId: command.userId,
      authorName: user.username,
      status: command.status,
    });

    this.usersClient.emit('blog.created', {
      id: blog.id,
      title: blog.title,
      userId: blog.userId,
    });

    return blog;
  }
}
