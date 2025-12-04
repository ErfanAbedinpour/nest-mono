import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../command/login.user.command';
import { SessionRepository, UserRepository } from '../../ports/repository.port';
import { CreateUserCommand } from '../command/create-user.command';
import { HandlerException } from '../exceptions/handler.exception';
import { Session } from '../../domain/entities/session';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userRepository: UserRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  async execute(command: LoginCommand) {
    const { password, username } = command;

    const user = await this.userRepository.findOneByUsername(username);
    console.log({ user });

    if (!user || user.password !== password) {
      throw new HandlerException('Invalid username or password');
    }

    try {
      const session = Session.create(user.id, {});
      console.log({ session });

      const token = await this.sessionRepo.create(session);
      console.log({ token });

      return { token: token.sessionId };
    } catch (err) {
      console.error(err);
      throw new HandlerException('Failed to create session');
    }
  }
}
