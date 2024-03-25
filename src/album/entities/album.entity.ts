import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({
    type: String,
    description: 'album id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'album name',
    example: 'Nevermind',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: "the year of the album's release",
    example: 1991,
  })
  year: number;

  @ApiProperty({
    type: String,
    description: 'artist id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  artistId: string | null;
}
