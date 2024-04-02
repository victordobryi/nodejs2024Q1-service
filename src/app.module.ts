import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter';
import { ErrorHandlingService } from './common/filters/ErrorHandlingService';
import { PrismaExceptionFilter } from './common/filters/PrismaExceptionFilter';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import JwtAuthGuard from './auth/guards/jwtAuth.guard';

@Module({
  imports: [
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
    LoggerModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    ErrorHandlingService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
