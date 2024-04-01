import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';
import { handleErrors } from '../utils/handleErrors';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Create artist' })
  @ApiBody({ type: CreateArtistDto, required: true })
  @ApiResponse({
    status: 201,
    type: Artist,
    description: 'The artist has been created.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return await handleErrors(this.artistService.create(createArtistDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({
    status: 200,
    description: 'Get all artists',
    type: [Artist],
  })
  async findAll(): Promise<Artist[]> {
    return await handleErrors(this.artistService.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  @ApiResponse({
    status: 200,
    type: Artist,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Artist not found',
  })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    const artist = await handleErrors(this.artistService.findById(id));
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get artist by name' })
  @ApiResponse({
    status: 200,
    type: Artist,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Artist not found',
  })
  async findByName(@Param('name') login: string): Promise<Artist> {
    const artist = await handleErrors(this.artistService.findByName(login));
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist' })
  @ApiBody({ type: UpdateArtistDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The artist has been updated',
    type: Artist,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Artist not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.findById(id);
    return await handleErrors(
      this.artistService.update(id, {
        ...artist,
        ...updateArtistDto,
      }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artist' })
  @ApiResponse({
    status: 204,
    description: 'Artist has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Artist not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Artist> {
    await this.findById(id);
    return await handleErrors(this.artistService.remove(id));
  }
}
