import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SyncUserCacheCommand } from '../command/sync-user-cache.command';
import { BlogRepository } from '../../ports/repository.port';

@CommandHandler(SyncUserCacheCommand)
export class SyncUserCacheHandler implements ICommandHandler<SyncUserCacheCommand> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(command: SyncUserCacheCommand) {
    await this.repository.upsertUserCache(command.userId, command.username);
  }
}
