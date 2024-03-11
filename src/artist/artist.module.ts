import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService, FavoritesService],
})
export class ArtistModule {}
