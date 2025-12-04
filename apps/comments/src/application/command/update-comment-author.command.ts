export class UpdateCommentAuthorCommand {
  constructor(
    public readonly userId: number,
    public readonly username: string,
  ) {}
}
