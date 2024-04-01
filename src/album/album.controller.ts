import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { handleErrors } from '../utils/handleErrors';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({ summary: 'Create album' })
  @ApiBody({ type: CreateAlbumDto, required: true })
  @ApiResponse({
    status: 201,
    type: Album,
    description: 'The album has been created.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await handleErrors(this.albumService.create(createAlbumDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: 200,
    description: 'Get all albums',
    type: [Album],
  })
  async findAll(): Promise<Album[]> {
    return await handleErrors(this.albumService.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by id' })
  @ApiResponse({
    status: 200,
    type: Album,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Album not found',
  })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    const album = await handleErrors(this.albumService.findById(id));
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get album by name' })
  @ApiResponse({
    status: 200,
    type: Album,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Album not found',
  })
  async findByName(@Param('name') name: string): Promise<Album> {
    const album = await handleErrors(this.albumService.findByName(name));
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album' })
  @ApiBody({ type: UpdateAlbumDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The Album has been updated',
    type: Album,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. AlbumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Album not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.findById(id);
    return await handleErrors(
      this.albumService.update(id, { ...album, ...updateAlbumDto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete album' })
  @ApiResponse({
    status: 204,
    description: 'Album has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Album not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Album> {
    await this.findById(id);
    return await handleErrors(this.albumService.remove(id));
  }
}
