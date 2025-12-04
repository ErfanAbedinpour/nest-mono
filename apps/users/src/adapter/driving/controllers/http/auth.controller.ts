import { Controller } from '@nestjs/common';
import { AuthService } from '../../../../application/services/auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'validate_session' })
  async validateSession(data: { sessionId: string }) {
    return this.authService.validateSession(data.sessionId);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    return this.authService.login(data.username, data.password);
  }
}
