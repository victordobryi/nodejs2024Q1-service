import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    type: String,
    description: 'artist id',
    format: 'uuid',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'artist name',
    example: 'Serj Tankian',
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'does this artist have a Grammy Award',
    example: false,
  })
  grammy: boolean;
}
