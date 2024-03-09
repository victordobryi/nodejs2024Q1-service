import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { InMemoryDB } from 'src/IMDB';
import { v4 } from 'uuid';

@Injectable()
export class ArtistService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const id = v4();

    return this.db.save(`artist.${id}`, {
      ...createArtistDto,
      id,
    });
  }

  async findAll(): Promise<Artist[] | null> {
    return this.db.getAll('artist');
  }

  async findById(id: string): Promise<Artist | null> {
    return this.db.get(`artist.${id}`);
  }

  async findByName(name: string): Promise<Artist | null> {
    return this.db.findByArtistName(name);
  }

  async update(id: string, artist: Artist): Promise<Artist> {
    return this.db.update(`artist.${id}`, artist);
  }

  async remove(id: string): Promise<Artist | null> {
    return this.db.delete(`artist.${id}`);
  }
}
