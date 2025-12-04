import { BlogStatus } from '../../domain/entities/blog';

export class CreateBlogCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly content: string,
    public readonly userId: number,
    public readonly status: BlogStatus,
  ) {}
}
