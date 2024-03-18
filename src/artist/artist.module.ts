import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { DatabaseModule } from '../database/database.module';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService, FavoritesService],
})
export class ArtistModule {}
