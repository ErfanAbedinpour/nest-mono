import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../../application/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
