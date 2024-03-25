import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    type: String,
    description: 'artist name',
    example: 'Serj Tankian',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'does this artist have a Grammy Award',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
