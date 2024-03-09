import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiTags } from '@nestjs/swagger';
import { handleErrors } from 'src/utils/handleErrors';
import { Artist } from './entities/artist.entity';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = await handleErrors(
      this.artistService.findByName(createArtistDto.name),
    );
    if (artist) throw new BadRequestException('Artist already exists');
    return await handleErrors(this.artistService.create(createArtistDto));
  }

  @Get()
  async findAll(): Promise<Artist[]> {
    return await handleErrors(this.artistService.findAll());
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    const artist = await handleErrors(this.artistService.findById(id));
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Get('name/:name')
  async findByName(@Param('name') login: string): Promise<Artist> {
    const artist = await handleErrors(this.artistService.findByName(login));
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    const deletedArtist = await handleErrors(this.artistService.remove(id));
    if (!deletedArtist) throw new NotFoundException('Artist not found');
    return deletedArtist;
  }
}
