import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { FindAllQuery } from '../query/findAll.query';
import { FindOneByIdQuery } from '../query/findOne-by-id.query';
import { UpdateUserCommand } from '../command/update-user.command';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(username: string, password: string) {
    return this.commandBus.execute(new CreateUserCommand(username, password));
  }

  async update(id: number, username?: string, password?: string) {
    return this.commandBus.execute(
      new UpdateUserCommand(id, username, password),
    );
  }

  async findAll() {
    return this.queryBus.execute(new FindAllQuery());
  }

  async findOne(id: string) {
    return this.queryBus.execute(new FindOneByIdQuery(id));
  }
}
