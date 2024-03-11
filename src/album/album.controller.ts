import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { handleErrors } from 'src/utils/handleErrors';
import { Album } from './entities/album.entity';
import { ApiTags } from '@nestjs/swagger';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    // const album = await handleErrors(
    //   this.albumService.findByName(createAlbumDto.name),
    // );
    // if (album) throw new BadRequestException('Album already exists');

    return await handleErrors(this.albumService.create(createAlbumDto));
  }

  @Get()
  async findAll(): Promise<Album[]> {
    return await handleErrors(this.albumService.findAll());
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    const album = await handleErrors(this.albumService.findById(id));
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Album> {
    const album = await handleErrors(this.albumService.findByName(name));
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.findById(id);
    return await handleErrors(
      this.albumService.update(id, { ...album, ...updateAlbumDto }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    const deletedAlbum = (await handleErrors(
      this.albumService.remove(id),
    )) as Album;
    if (!deletedAlbum) throw new NotFoundException('Album not found');
    const tracks = await this.trackService.findAll();
    const albumTracks = tracks.filter(
      (track) => track.albumId === deletedAlbum.id,
    );
    for (const track of albumTracks) {
      await this.trackService.update(track.id, { ...track, albumId: null });
    }
    await this.favoritesService.removeAlbum(deletedAlbum.id);
    return deletedAlbum;
  }
}
