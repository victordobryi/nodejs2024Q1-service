import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites.entity';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<FavoritesResponse> {
    const artists = this.db.getAll('favs.artist') as Artist[];
    const albums = this.db.getAll('favs.album') as Album[];
    const tracks = this.db.getAll('favs.track') as Track[];

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(track: Track): Promise<FavoritesResponse> {
    return this.db.save(`favs.track.${track.id}`, track);
  }

  async removeTrack(id: string): Promise<FavoritesResponse> {
    return this.db.delete(`favs.track.${id}`);
  }

  async addAlbum(album: Album): Promise<FavoritesResponse> {
    return this.db.save(`favs.album.${album.id}`, album);
  }

  async removeAlbum(id: string): Promise<FavoritesResponse> {
    return this.db.delete(`favs.album.${id}`);
  }

  async addArtist(artist: Artist): Promise<FavoritesResponse> {
    return this.db.save(`favs.artist.${artist.id}`, artist);
  }

  async removeArtist(id: string): Promise<FavoritesResponse> {
    return this.db.delete(`favs.artist.${id}`);
  }
}
