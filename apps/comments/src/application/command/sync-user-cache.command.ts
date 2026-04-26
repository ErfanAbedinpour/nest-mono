export class SyncUserCacheCommand {
  constructor(
    public readonly userId: number,
    public readonly username: string,
  ) {}
}
