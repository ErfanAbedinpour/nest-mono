import { Query } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user';

export type UserId = string;

export class FindOneByIdQuery extends Query<User | null> {
  constructor(public userId: UserId) {
    super();
  }
}
