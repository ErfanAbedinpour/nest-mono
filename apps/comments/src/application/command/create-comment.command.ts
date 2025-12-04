export class CreateCommentCommand {
  constructor(
    public readonly content: string,
    public readonly blogId: number,
    public readonly userId: number,
  ) {}
}
