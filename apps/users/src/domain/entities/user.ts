import { ApiProperty } from '@nestjs/swagger';
import { Entity } from '../../../../../libs/_shared/src/global/entity';

export class User extends Entity {
  @ApiProperty({ type: 'string', example: 'john_doe' })
  username: string;

  password: string;
}
