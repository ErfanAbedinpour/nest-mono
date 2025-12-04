import { Repository } from '../../../../libs/_shared/src/ports/repository.port';
import { User } from '../domain/entities/user';

export abstract class UserRepository extends Repository<User> {
  // abstract findOneById(id: number): Promise<User | null>;
  abstract create(user: Omit<User, 'id'>): Promise<User>;
  abstract findOneByUsername(username: string): Promise<User | null>;
  // abstract findAll(): Promise<User[]>;
}
