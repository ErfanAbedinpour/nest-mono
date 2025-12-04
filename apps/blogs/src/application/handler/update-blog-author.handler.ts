import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogAuthorCommand } from '../command/update-blog-author.command';
import { BlogRepository } from '../../ports/repository.port';

@CommandHandler(UpdateBlogAuthorCommand)
export class UpdateBlogAuthorHandler
  implements ICommandHandler<UpdateBlogAuthorCommand>
{
  constructor(private readonly repository: BlogRepository) {}

  async execute(command: UpdateBlogAuthorCommand) {
    await this.repository.updateAuthorName(command.userId, command.authorName);
  }
}
