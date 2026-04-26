import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../command/create-comment.command';
import { CommentRepository } from '../../ports/repository.port';
import { AppException } from '@app/_shared/error/app.exception';
import { ErrorCode } from '@app/_shared/error/error-codes';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(command: CreateCommentCommand) {
    const cachedUser = await this.repository.findCachedUser(command.userId);
    if (!cachedUser) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    return this.repository.create({
      content: command.content,
      blogId: command.blogId,
      userId: command.userId,
      authorUsername: cachedUser.username,
    });
  }
}
