import { Query } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user';

export class FindAllQuery extends Query<User[]> {}
