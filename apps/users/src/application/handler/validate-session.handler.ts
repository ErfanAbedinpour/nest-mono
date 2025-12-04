import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateSessionQuery } from '../query/validate-session.query';
import { SessionRepository } from '../../ports/repository.port';

@QueryHandler(ValidateSessionQuery)
export class ValidateSessionHandler
  implements IQueryHandler<ValidateSessionQuery>
{
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(query: ValidateSessionQuery) {
    const session = await this.sessionRepository.findOneBySessionId(
      query.sessionId,
    );
    if (!session) return null;

    // Check expiration
    if (new Date() > session.expiredAt) {
      return null;
    }

    return {
      id: session.userId,
      ...session.metadata,
    };
  }
}
