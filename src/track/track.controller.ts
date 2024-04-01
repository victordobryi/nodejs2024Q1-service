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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';
import { handleErrors } from '../utils/handleErrors';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({ summary: 'Create track' })
  @ApiBody({ type: CreateTrackDto, required: true })
  @ApiResponse({
    status: 201,
    type: Track,
    description: 'The track has been created.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return await handleErrors(this.trackService.create(createTrackDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'Get all tracks',
    type: [Track],
  })
  async findAll(): Promise<Track[]> {
    return await handleErrors(this.trackService.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get track by id' })
  @ApiResponse({
    status: 200,
    type: Track,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Track not found',
  })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    const track = await handleErrors(this.trackService.findById(id));
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get track by name' })
  @ApiResponse({
    status: 200,
    type: Track,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Track not found',
  })
  async findByName(@Param('name') name: string): Promise<Track> {
    const track = await handleErrors(this.trackService.findByName(name));
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track' })
  @ApiBody({ type: UpdateTrackDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The track has been updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Track not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const track = await this.findById(id);
    return await handleErrors(
      this.trackService.update(id, { ...track, ...updateTrackDto }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiResponse({
    status: 204,
    description: 'Track has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Track not found',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    await this.findById(id);
    return await handleErrors(this.trackService.remove(id));
  }
}
