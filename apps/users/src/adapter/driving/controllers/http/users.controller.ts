import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from '../../../../application/services/users.service';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User } from '../../../../domain/entities/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async create(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password)
      throw new BadRequestException('Username and password is required');

    return this.usersService.create(body.username, body.password);
  }

  @Get()
  @ApiOkResponse({ type: [User] })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    const res = await this.usersService.findOne(id);
    if (!res) throw new NotFoundException(`User with id ${id} not found`);
    return res;
  }
}
