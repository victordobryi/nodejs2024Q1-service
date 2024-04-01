import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponse> {
    const favorite = await this.prisma.favorite.findFirst({
      include: {
        artists: true,
        tracks: true,
        albums: true,
      },
    });

    return { albums: [], tracks: [], artists: [], ...favorite };
  }

  async addTrack(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ tracks: { connect: { id } } });
  }

  async removeTrack(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ tracks: { disconnect: { id } } });
  }

  async addAlbum(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ albums: { connect: { id } } });
  }

  async removeAlbum(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ albums: { disconnect: { id } } });
  }

  async addArtist(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ artists: { connect: { id } } });
  }

  async removeArtist(id: string): Promise<FavoritesResponse> {
    return this.updateFavorite({ artists: { disconnect: { id } } });
  }

  private async getFavoriteOrCreate() {
    const favorite = await this.prisma.favorite.findFirst();
    if (!favorite) {
      return this.prisma.favorite.create({
        data: {},
      });
    }
    return favorite;
  }

  private async updateFavorite(data: any): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data,
    });
    return this.findAll();
  }
}
