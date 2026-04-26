import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateBlogAuthorCommand } from '../../../../application/command/update-blog-author.command';
import { SyncUserCacheCommand } from '../../../../application/command/sync-user-cache.command';

@Controller()
export class BlogsEventController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('user.created')
  async handleUserCreated(data: { id: number; username: string }) {
    await this.commandBus.execute(
      new SyncUserCacheCommand(data.id, data.username),
    );
  }

  @EventPattern('user.updated')
  async handleUserUpdated(data: { id: number; username: string }) {
    await this.commandBus.execute(
      new UpdateBlogAuthorCommand(data.id, data.username),
    );
  }
}
