import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../../ports/repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Session } from '../../../../../domain/entities/session';
import { SessionMapper } from '../mapper/session.mapper';

@Injectable()
export class TypeOrmSessionRepository extends SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {
    super();
  }

  async create(session: Omit<Session, 'id'>): Promise<Session> {
    const sessionEntity = this.sessionRepository.create({
      sessionId: session.sessionId,
      metadata: session.metadata,
      expiredAt: session.expiredAt,
      user: { id: Number(session.userId) },
    });
    console.log({ sessionEntity });

    await this.sessionRepository.save(sessionEntity);
    return SessionMapper.toDomain(sessionEntity);
  }

  deleteBySessionId(sessionId: string): Promise<void> {
    return this.sessionRepository.delete({ sessionId }).then(() => undefined);
  }

  findOneBySessionId(sessionId: string): Promise<Session | null> {
    return this.sessionRepository
      .findOne({ where: { sessionId }, relations: { user: true } })
      .then((entity) => (entity ? SessionMapper.toDomain(entity) : null));
  }
}
