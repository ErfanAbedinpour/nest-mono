import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from '../../../../application/services/users.service';
import { ApiBody } from '@nestjs/swagger';

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
}
