import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findById(id: string): Promise<Artist | null> {
    return await this.prisma.artist.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Artist | null> {
    return await this.prisma.artist.findFirst({ where: { name } });
  }

  async update(id: string, artist: Artist): Promise<Artist> {
    return await this.prisma.artist.update({ where: { id }, data: artist });
  }

  async remove(id: string): Promise<Artist | null> {
    return await this.prisma.artist.delete({ where: { id } });
  }
}
