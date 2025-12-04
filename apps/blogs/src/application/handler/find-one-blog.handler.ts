import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneBlogQuery } from '../query/find-one-blog.query';
import { BlogRepository } from '../../ports/repository.port';
import { AppException } from '../../../../../libs/_shared/src/error/app.exception';
import { ErrorCode } from '../../../../../libs/_shared/src/error/error-codes';

@QueryHandler(FindOneBlogQuery)
export class FindOneBlogHandler implements IQueryHandler<FindOneBlogQuery> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(query: FindOneBlogQuery) {
    const blog = await this.repository.findOne(query.id);
    if (!blog) {
      throw new AppException(ErrorCode.BLOG_NOT_FOUND);
    }
    return blog;
  }
}
