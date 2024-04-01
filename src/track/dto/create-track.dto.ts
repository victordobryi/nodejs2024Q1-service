import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    type: String,
    description: 'track name',
    example: 'Smells Like Teen Spirit',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'artist id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsString()
  @ValidateIf((obj) => obj.artistId !== null)
  @IsUUID()
  artistId: string | null;

  @ApiProperty({
    type: String,
    description: 'albumId id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsString()
  @ValidateIf((obj) => obj.albumId !== null)
  @IsUUID()
  albumId: string | null;

  @ApiProperty({
    type: Number,
    description: 'track duration',
    example: 120,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
