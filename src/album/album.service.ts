import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryDB } from 'src/IMDB';
import { Album } from './entities/album.entity';
import { v4 } from 'uuid';

@Injectable()
export class AlbumService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

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
    return this.db.findByAlbumName(name);
  }

  async update(id: string, album: Album): Promise<Album> {
    return this.db.update(`album.${id}`, album);
  }

  async remove(id: string) {
    return this.db.delete(`album.${id}`);
  }
}
