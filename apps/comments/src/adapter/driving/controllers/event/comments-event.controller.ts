import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentAuthorCommand } from '../../../../application/command/update-comment-author.command';

@Controller()
export class CommentsEventController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('user.updated')
  async handleUserUpdated(data: { id: number; username: string }) {
    await this.commandBus.execute(
      new UpdateCommentAuthorCommand(data.id, data.username),
    );
  }
}
