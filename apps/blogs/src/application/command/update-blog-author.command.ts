export class UpdateBlogAuthorCommand {
  constructor(
    public readonly userId: number,
    public readonly authorName: string,
  ) {}
}
