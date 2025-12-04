import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindCommentsByBlogIdQuery } from '../query/find-comments-by-blog-id.query';
import { CommentRepository } from '../../ports/repository.port';

@QueryHandler(FindCommentsByBlogIdQuery)
export class FindCommentsByBlogIdHandler
  implements IQueryHandler<FindCommentsByBlogIdQuery>
{
  constructor(private readonly repository: CommentRepository) {}

  async execute(query: FindCommentsByBlogIdQuery) {
    return this.repository.findByBlogId(query.blogId);
  }
}
