import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../command/create-blog.command';
import { BlogRepository } from '../../ports/repository.port';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(command: CreateBlogCommand) {
    const cachedUser = await this.repository.findCachedUser(command.userId);
    if (!cachedUser) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    return this.repository.create({
      title: command.title,
      description: command.description,
      content: command.content,
      userId: command.userId,
      authorName: cachedUser.username,
      status: command.status,
    });
  }
}
