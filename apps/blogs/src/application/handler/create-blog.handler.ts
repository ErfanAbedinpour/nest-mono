import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../command/create-blog.command';
import { BlogRepository } from '../../ports/repository.port';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(command: CreateBlogCommand) {
    return this.repository.create({
      title: command.title,
      description: command.description,
      content: command.content,
      userId: command.userId,
      status: command.status,
    });
  }
}
