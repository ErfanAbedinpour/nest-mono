import { ApiProperty } from '@nestjs/swagger';
import { Entity } from '@app/_shared/global/entity';

export class User extends Entity {
  @ApiProperty({ type: 'string', example: 'john_doe' })
  username: string;

  password: string;
}
