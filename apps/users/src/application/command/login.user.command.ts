import { Command } from '@nestjs/cqrs';

export class LoginCommand extends Command<{ token: string }> {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {
    super();
  }
}
