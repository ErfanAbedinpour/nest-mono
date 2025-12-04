import { Entity } from '../../../../../libs/_shared/src/global/entity';
import { randomUUID } from 'crypto';

export class Session extends Entity {
  sessionId: string;
  userId: string;
  metadata: Record<string, any>;
  expiredAt: Date;

  static create(userId: string, metadata: Record<string, any>) {
    console.log('start');

    const session = new Session();
    session.userId = userId;
    session.sessionId = randomUUID();
    session.metadata = metadata;
    session.expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    console.log({ session });
    return session;
  }

  isExpired() {
    return this.expiredAt < new Date();
  }
}
