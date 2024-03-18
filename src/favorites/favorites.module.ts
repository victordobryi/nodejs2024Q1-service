import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { DatabaseModule } from '../database/database.module';
import { ArtistService } from '../artist/artist.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, TrackService, AlbumService, ArtistService],
})
export class FavoritesModule {}
