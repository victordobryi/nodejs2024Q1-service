import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class User {
  @ApiProperty({
    type: String,
    description: 'user id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'user login',
    example: 'victordobryi',
  })
  login: string;

  @ApiProperty({
    type: String,
    description: 'user password',
    example: '123456Exa@mple',
  })
  @Exclude()
  password: string;

  @ApiProperty({
    type: Number,
    description: 'increments on update',
    example: 1,
  })
  version: number;

  @ApiProperty({
    type: Number,
    description: 'timestamp of creation',
    format: 'date-time',
    example: 1672639673,
  })
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  createdAt: number;

  @ApiProperty({
    type: Number,
    description: 'timestamp of last update',
    format: 'date-time',
    example: 1672639673,
  })
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  updatedAt: number;
}
