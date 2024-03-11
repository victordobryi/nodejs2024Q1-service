import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, FavoritesService],
})
export class AlbumModule {}
