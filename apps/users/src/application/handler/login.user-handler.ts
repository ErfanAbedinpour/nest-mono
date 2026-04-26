import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../command/login.user.command';
import { SessionRepository, UserRepository } from '../../ports/repository.port';
import { Session } from '../../domain/entities/session';
import { ErrorCode } from '@app/_shared/error/error-codes';
import { AppException } from '@app/_shared/error/app.exception';
import { PasswordHasher } from '../../ports/password-hasher.port';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userRepository: UserRepository,
    private readonly sessionRepo: SessionRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(command: LoginCommand) {
    const { password, username } = command;

    const user = await this.userRepository.findOneByUsername(username);
    const isPasswordValid = user ? await this.hasher.compare(password, user.password) : false;

    if (!user || !isPasswordValid) {
      throw new AppException(ErrorCode.INVALID_CREDENTIALS);
    }

    try {
      const session = Session.create(user.id, {});
      console.log({ session });

      const token = await this.sessionRepo.create(session);
      console.log({ token });

      return { token: token.sessionId };
    } catch (err) {
      console.error(err);
      throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
