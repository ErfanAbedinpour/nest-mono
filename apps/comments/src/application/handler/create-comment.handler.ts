import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../command/create-comment.command';
import { CommentRepository } from '../../ports/repository.port';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(command: CreateCommentCommand) {
    return this.repository.create({
      content: command.content,
      blogId: command.blogId,
      userId: command.userId,
    });
  }
}
