import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({ data: createAlbumDto });
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findById(id: string): Promise<Album | null> {
    return await this.prisma.album.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Album | null> {
    return await this.prisma.album.findFirst({ where: { name } });
  }

  async update(id: string, album: Album): Promise<Album> {
    return await this.prisma.album.update({ where: { id }, data: album });
  }

  async remove(id: string) {
    return await this.prisma.album.delete({ where: { id } });
  }
}
