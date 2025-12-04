import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneByIdQuery } from '../query/findOne-by-id.query';
import { UserRepository } from '../../ports/repository.port';
import { ErrorCode } from '@app/_shared/error/error-codes';
import { AppException } from '@app/_shared/error/app.exception';

@QueryHandler(FindOneByIdQuery)
export class FindOneUserHandler implements IQueryHandler<FindOneByIdQuery> {
  constructor(private repository: UserRepository) {}

  async execute(query: FindOneByIdQuery) {
    const user = await this.repository.findById(query.userId);
    if (!user) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }
}
