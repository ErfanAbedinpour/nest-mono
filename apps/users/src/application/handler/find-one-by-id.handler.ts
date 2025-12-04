import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneByIdQuery } from '../query/findOne-by-id.query';
import { UserRepository } from '../../ports/repository.port';

@QueryHandler(FindOneByIdQuery)
export class FindOneUserHandler implements IQueryHandler<FindOneByIdQuery> {
  constructor(private repository: UserRepository) {}

  async execute(query: FindOneByIdQuery) {
    return this.repository.findById(query.userId);
  }
}
