import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../command/create-user.command';
import { HandlerException } from '../exceptions/handler.exception';
import { FindAllQuery } from '../query/findAll.query';
import { FindOneByIdQuery } from '../query/findOne-by-id.query';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(username: string, password: string) {
    try {
      const res = await this.commandBus.execute(
        new CreateUserCommand(username, password),
      );
      return res;
    } catch (err) {
      if (err instanceof HandlerException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(`Failed to create user`);
    }
  }

  async findAll() {
    return this.queryBus.execute(new FindAllQuery());
  }

  async findOne(id: string) {
    return this.queryBus.execute(new FindOneByIdQuery(id));
  }
}
