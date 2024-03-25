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
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FavoritesResponse } from './entities/favorites.entity';
import { handleErrors } from '../utils/handleErrors';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { ArtistService } from '../artist/artist.service';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';

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
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'Get all favorites',
    type: FavoritesResponse,
  })
  async findAll(): Promise<FavoritesResponse> {
    return await handleErrors(this.favoritesService.findAll());
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiResponse({
    status: 200,
    type: Track,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 422,
    description: 'Track not found',
  })
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const track = await handleErrors(this.trackService.findById(id));
    if (!track) throw new UnprocessableEntityException('Track not found');
    return await handleErrors(this.favoritesService.addTrack(id));
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Track has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 404,
    description: 'Track not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const track = await this.trackService.findById(id);
    if (!track) throw new NotFoundException('Track not found');
    return await handleErrors(this.favoritesService.removeTrack(id));
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiResponse({
    status: 200,
    type: Album,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 422,
    description: 'Album not found',
  })
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const album = await this.albumService.findById(id);
    if (!album) throw new UnprocessableEntityException('Album not found');
    return await handleErrors(this.favoritesService.addAlbum(id));
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Album has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 404,
    description: 'Album not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const album = await this.albumService.findById(id);
    if (!album) throw new NotFoundException('Album not found');
    return await handleErrors(this.favoritesService.removeAlbum(id));
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiResponse({
    status: 200,
    type: Artist,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 422,
    description: 'Artist not found',
  })
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const artist = await this.artistService.findById(id);
    if (!artist) throw new UnprocessableEntityException('Artist not found');
    return await handleErrors(this.favoritesService.addArtist(id));
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiResponse({
    status: 204,
    description: 'Artist has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    status: 404,
    description: 'Artist not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const album = await this.artistService.findById(id);
    if (!album) throw new NotFoundException('Artist not found');
    return await handleErrors(this.favoritesService.removeArtist(id));
  }
}
