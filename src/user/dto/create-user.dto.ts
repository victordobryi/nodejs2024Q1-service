import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'user login',
    example: 'victordobryi',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    type: String,
    description: 'user password',
    example: '123456Exa@mple',
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
