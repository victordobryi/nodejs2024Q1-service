import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { ArtistService } from '../artist/artist.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    TrackService,
    AlbumService,
    ArtistService,
    PrismaService,
  ],
})
export class FavoritesModule {}
