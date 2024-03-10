import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiTags } from '@nestjs/swagger';
import { Track } from './entities/track.entity';
import { handleErrors } from 'src/utils/handleErrors';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    const track = await handleErrors(
      this.trackService.findByName(createTrackDto.name),
    );
    if (track) throw new BadRequestException('Track already exists');
    return await handleErrors(this.trackService.create(createTrackDto));
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return await handleErrors(this.trackService.findAll());
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const track = await handleErrors(this.trackService.findById(id));
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Track> {
    const track = await handleErrors(this.trackService.findByName(name));
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const track = await this.findById(id);
    return await handleErrors(
      this.trackService.update(id, { ...track, ...updateTrackDto }),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const deletedTrack = await handleErrors(this.trackService.remove(id));
    if (!deletedTrack) throw new NotFoundException('Track not found');
    return deletedTrack;
  }
}
