import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.prisma.track.create({ data: createTrackDto });
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findById(id: string): Promise<Track | null> {
    return await this.prisma.track.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Track | null> {
    return await this.prisma.track.findFirst({ where: { name } });
  }

  async update(id: string, track: Track): Promise<Track> {
    return await this.prisma.track.update({ where: { id }, data: track });
  }

  async remove(id: string) {
    return await this.prisma.track.delete({ where: { id } });
  }
}
