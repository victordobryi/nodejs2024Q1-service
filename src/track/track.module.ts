import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from '../database/database.module';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService, FavoritesService],
})
export class TrackModule {}
