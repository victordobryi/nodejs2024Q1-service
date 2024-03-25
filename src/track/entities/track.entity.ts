import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    type: String,
    description: 'track id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'track name',
    example: 'Smells Like Teen Spirit',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'artist id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  artistId: string | null;

  @ApiProperty({
    type: String,
    description: 'albumId id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  albumId: string | null;

  @ApiProperty({
    type: Number,
    description: 'track duration',
    example: 120,
  })
  duration: number;
}
