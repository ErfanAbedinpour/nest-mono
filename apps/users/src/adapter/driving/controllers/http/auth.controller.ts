import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { PostgresDriver } from 'typeorm/browser/platform/BrowserDisabledDriversDummy.js';
import { AuthService } from '../../../../application/services/auth.service';
import { ApiBody } from '@nestjs/swagger';
import { HandlerException } from '../../../../application/exceptions/handler.exception';
import { getSystemErrorMessage } from 'util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'strongPassword123' },
      },
      required: ['username', 'password'],
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }
    try {
      const res = await this.authService.login(body.username, body.password);
      console.log({ res });
      return res;
    } catch (err) {
      if (err instanceof HandlerException)
        throw new BadRequestException(err.message);
      throw new InternalServerErrorException();
    }
  }
}
