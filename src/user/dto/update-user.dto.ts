import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'previous password',
    example: '123456Exa@mple',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'new password',
    example: '123456ExampleNew',
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
