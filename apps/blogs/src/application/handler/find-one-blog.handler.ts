import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneBlogQuery } from '../query/find-one-blog.query';
import { BlogRepository } from '../../ports/repository.port';

@QueryHandler(FindOneBlogQuery)
export class FindOneBlogHandler implements IQueryHandler<FindOneBlogQuery> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(query: FindOneBlogQuery) {
    return this.repository.findOne(query.id);
  }
}
