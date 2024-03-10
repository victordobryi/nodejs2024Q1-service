import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryDB } from 'src/IMDB';
import { Track } from './entities/track.entity';
import { v4 } from 'uuid';

@Injectable()
export class TrackService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const id = v4();
    return this.db.save(`track.${id}`, { ...createTrackDto, id });
  }

  async findAll(): Promise<Track[]> {
    return this.db.getAll('track');
  }

  async findById(id: string): Promise<Track | null> {
    return this.db.get(`track.${id}`);
  }

  async findByName(name: string): Promise<Track | null> {
    return this.db.findByTrackName(name);
  }

  async update(id: string, track: Track): Promise<Track> {
    return this.db.update(`track.${id}`, track);
  }

  async remove(id: string) {
    return this.db.delete(`track.${id}`);
  }
}
