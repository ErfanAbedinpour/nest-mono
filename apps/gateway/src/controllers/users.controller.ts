import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async create(@Body() body: any) {
    return this.usersClient.send({ cmd: 'create_user' }, body);
  }

  @Get()
  async findAll() {
    return this.usersClient.send({ cmd: 'find_all_users' }, {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'find_one_user' }, { id });
  }
}
