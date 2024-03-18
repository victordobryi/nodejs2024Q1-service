import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { v4 } from 'uuid';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackService {
  constructor(private readonly db: DatabaseService) {}

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
    return this.db.findByProperty('track', 'name', name);
  }

  async update(id: string, track: Track): Promise<Track> {
    return this.db.update(`track.${id}`, track);
  }

  async remove(id: string) {
    return this.db.delete(`track.${id}`);
  }
}
