import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async update(@Req() req: any, @Body() body: any) {
    return this.usersClient.send(
      { cmd: 'update_user' },
      { id: req.user.id, ...body },
    );
  }
}
