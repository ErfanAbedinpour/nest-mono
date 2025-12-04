export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly username?: string,
    public readonly password?: string,
  ) {}
}
