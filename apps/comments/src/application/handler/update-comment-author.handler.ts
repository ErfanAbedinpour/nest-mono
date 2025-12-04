import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentAuthorCommand } from '../command/update-comment-author.command';
import { CommentRepository } from '../../ports/repository.port';

@CommandHandler(UpdateCommentAuthorCommand)
export class UpdateCommentAuthorHandler
  implements ICommandHandler<UpdateCommentAuthorCommand>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(command: UpdateCommentAuthorCommand): Promise<void> {
    await this.repository.updateAuthorUsername(
      command.userId,
      command.username,
    );
  }
}
