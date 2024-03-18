import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';

export class Favorites {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'favorite artists ids',
    format: 'uuid',
    example: [
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
    ],
  })
  artists: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'favorite albums ids',
    format: 'uuid',
    example: [
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
    ],
  })
  albums: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'favorite tracks ids',
    format: 'uuid',
    example: [
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
      'd290f1ee-6c54-4b01-90e6-d701748f0851',
    ],
  })
  tracks: string[];
}

export class FavoritesResponse {
  @ApiProperty({
    type: Artist,
    isArray: true,
    description: 'favorite artists',
    format: 'array of artists',
    example: [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Serj Tankian',
        grammy: true,
      },
      {
        id: 'e311f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Maroon 5',
        grammy: false,
      },
    ],
  })
  artists: Artist[];

  @ApiProperty({
    type: Album,
    isArray: true,
    description: 'favorite albums',
    format: 'array of albums',
    example: [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Nevermind',
        year: 1991,
        artistId: 'e312e1ee-6c54-4b01-90e6-d701748f0851',
      },
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Toxicity',
        year: 2001,
        artistId: 'e312e1ee-6c54-4b01-90e6-d701748f0851',
      },
    ],
  })
  albums: Album[];

  @ApiProperty({
    type: Track,
    isArray: true,
    description: 'favorite tracks',
    format: 'array of tracks',
    example: [
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Smells Like Teen Spirit',
        duration: 120,
        artistId: 'e312e1ee-6c54-4b01-90e6-d701748f0851',
        albumId: 'e312e1ee-6c54-4b01-90e6-d701748f0851',
      },
      {
        id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        name: 'Jet Pilot',
        duration: 145,
        artistId: 'e312e1ee-6c54-4b01-90e6-d701748f0851',
        albumId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      },
    ],
  })
  tracks: Track[];
}
