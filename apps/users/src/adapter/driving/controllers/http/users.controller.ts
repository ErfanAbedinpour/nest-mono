import { Controller } from '@nestjs/common';
import { UsersService } from '../../../../application/services/users.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(data: { username: string; password: string }) {
    return this.usersService.create(data.username, data.password);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_user' })
  async findOne(data: { id: string }) {
    return this.usersService.findOne(data.id);
  }
}
