import { Command } from '@nestjs/cqrs';
import { User } from '../../domain/entities/user';

export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {
    super();
  }
}
