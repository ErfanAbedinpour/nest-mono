import { Entity } from '@app/_shared/global/entity';
import { randomUUID } from 'crypto';

export class Session extends Entity {
  constructor(
    public sessionId: string,
    public userId: string,
    public metadata: Record<string, any>,
    public expiredAt: Date,

  ){
    super()
  }
    
  static create(userId: string, metadata: Record<string, any>) {
    const session = new Session(
      randomUUID(),
      userId,
      metadata,
      new Date(Date.now() + 1000 * 60 * 60 * 24));
      return session;
  }

  isExpired() {
    return this.expiredAt < new Date();
  }
}
