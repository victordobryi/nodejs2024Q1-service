import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    type: String,
    description: 'album name',
    example: 'Nevermind',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    description: "the year of the album's release",
    example: 1991,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

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
}
