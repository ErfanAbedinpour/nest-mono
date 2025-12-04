import { PartialType, PickType } from '@nestjs/swagger';
import { Repository } from '@app/_shared/ports/repository.port';
import { Session } from '../domain/entities/session';
import { User } from '../domain/entities/user';

export abstract class UserRepository extends Repository<User> {
  // abstract findOneById(id: number): Promise<User | null>;
  abstract create(user: Omit<User, 'id'>): Promise<User>;
  abstract findOneByUsername(username: string): Promise<User | null>;
  abstract update(id: number, user: Partial<User>): Promise<User>;
  // abstract findAll(): Promise<User[]>;
}

export abstract class SessionRepository extends Repository<Session> {
  abstract create(session: Omit<Session, 'id'>): Promise<Session>;
  abstract findOneBySessionId(sessionId: string): Promise<Session | null>;
  abstract deleteBySessionId(sessionId: string): Promise<void>;
  findAll(): Promise<Session[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Session | null> {
    throw new Error('Method not implemented.');
  }
}
