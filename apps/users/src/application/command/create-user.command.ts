import { Command } from '@nestjs/cqrs';

export class CreateUserCommand extends Command<void> {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {
    super();
  }
}
