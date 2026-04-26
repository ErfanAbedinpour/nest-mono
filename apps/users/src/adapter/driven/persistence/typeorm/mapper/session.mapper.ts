import { Session } from '../../../../../domain/entities/session';
import { SessionEntity } from '../entities/session.entity';
import { UserEntity } from '../entities/user.entity';

export class SessionMapper {
  static toDomain(session: SessionEntity): Session {
    const sessionDomain = new Session(
      session.sessionId,
      session.user?.id.toString() || '',
      session.metadata,
      session.expiredAt
    );
        return sessionDomain;
  }

  static toEntity(session: Session, user: UserEntity): SessionEntity {
    const sessionEntity = new SessionEntity();
    sessionEntity.id = Number(session.id);
    sessionEntity.sessionId = session.sessionId;
    sessionEntity.user = user;
    sessionEntity.metadata = session.metadata;
    sessionEntity.expiredAt = session.expiredAt;
    return sessionEntity;
  }
}
