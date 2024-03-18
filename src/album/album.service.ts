import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { v4 } from 'uuid';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumService {
  constructor(private readonly db: DatabaseService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const id = v4();
    return this.db.save(`album.${id}`, { ...createAlbumDto, id });
  }

  async findAll(): Promise<Album[]> {
    return this.db.getAll('album');
  }

  async findById(id: string): Promise<Album | null> {
    return this.db.get(`album.${id}`);
  }

  async findByName(name: string): Promise<Album | null> {
    return this.db.findByProperty('album', 'name', name);
  }

  async update(id: string, album: Album): Promise<Album> {
    return this.db.update(`album.${id}`, album);
  }

  async remove(id: string) {
    return this.db.delete(`album.${id}`);
  }
}
