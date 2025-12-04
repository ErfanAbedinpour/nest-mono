import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllBlogsQuery } from '../query/find-all-blogs.query';
import { BlogRepository } from '../../ports/repository.port';

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsHandler implements IQueryHandler<FindAllBlogsQuery> {
  constructor(private readonly repository: BlogRepository) {}

  async execute(query: FindAllBlogsQuery) {
    return this.repository.findAll(query.skip, query.take);
  }
}
