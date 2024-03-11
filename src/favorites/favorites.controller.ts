import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  UnprocessableEntityException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags } from '@nestjs/swagger';
import { FavoritesResponse } from './entities/favorites.entity';
import { handleErrors } from 'src/utils/handleErrors';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return await handleErrors(this.favoritesService.findAll());
  }

  @Post('track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = await handleErrors(this.trackService.findById(id));
    if (!track) throw new UnprocessableEntityException('Track not found');
    return await handleErrors(this.favoritesService.addTrack(track));
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    const track = await this.trackService.findById(id);
    if (!track) throw new UnprocessableEntityException('Track not found');
    return await handleErrors(this.favoritesService.removeTrack(id));
  }

  @Post('album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const album = await this.albumService.findById(id);
    if (!album) throw new UnprocessableEntityException('Album not found');
    return await handleErrors(this.favoritesService.addAlbum(album));
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    const album = await this.albumService.findById(id);
    if (!album) throw new UnprocessableEntityException('Album not found');
    return await handleErrors(this.favoritesService.removeAlbum(id));
  }

  @Post('artist/:id')
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = await this.artistService.findById(id);
    if (!artist) throw new UnprocessableEntityException('Artist not found');
    return await handleErrors(this.favoritesService.addArtist(artist));
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    const album = await this.artistService.findById(id);
    if (!album) throw new UnprocessableEntityException('Artist not found');
    return await handleErrors(this.favoritesService.removeArtist(id));
  }
}
