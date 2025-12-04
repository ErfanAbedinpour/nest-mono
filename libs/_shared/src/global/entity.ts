import { ApiProperty } from '@nestjs/swagger';

export class Entity {
  @ApiProperty({ type: 'string', example: 'uuid-v4-string' })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt?: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-02T00:00:00.000Z',
    required: false,
  })
  updatedAt?: Date;
}
