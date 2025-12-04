import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllQuery } from '../query/findAll.query';
import { UserRepository } from '../../ports/repository.port';

@QueryHandler(FindAllQuery)
export class GetAllUserHandler implements IQueryHandler<FindAllQuery> {
  constructor(private repository: UserRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
