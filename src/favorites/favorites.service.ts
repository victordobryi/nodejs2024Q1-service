import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<FavoritesResponse> {
    const tracks = await this.getAllTracks();
    const albums = await this.getAllAlbums();
    const artists = await this.getAllArtists();

    return {
      tracks,
      albums,
      artists,
    };
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.db.getAll('favsAlbums') as Album[];
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.db.getAll('favsArtists') as Artist[];
  }

  async getAllTracks(): Promise<Track[]> {
    return this.db.getAll('favsTracks') as Track[];
  }

  async addTrack(track: Track): Promise<Track> {
    this.db.save(`favsTracks.${track.id}`, track);
    return track;
  }

  async removeTrack(id: string): Promise<FavoritesResponse> {
    this.db.delete(`favsTracks.${id}`);
    return await this.findAll();
  }

  async addAlbum(album: Album): Promise<Album> {
    this.db.save(`favsAlbums.${album.id}`, album);
    return album;
  }

  async removeAlbum(id: string): Promise<FavoritesResponse> {
    return this.db.delete(`favsAlbums.${id}`);
  }

  async addArtist(artist: Artist): Promise<Artist> {
    this.db.save(`favsArtists.${artist.id}`, artist);
    return artist;
  }

  async removeArtist(id: string): Promise<FavoritesResponse> {
    this.db.delete(`favsArtists.${id}`);
    return await this.findAll();
  }
}
