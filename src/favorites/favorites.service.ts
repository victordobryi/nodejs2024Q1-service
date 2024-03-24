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
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: {
        tracks: {
          connect: {
            id,
          },
        },
      },
    });
    return await this.findAll();
  }

  async removeTrack(id: string): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: { tracks: { disconnect: { id } } },
    });
    return await this.findAll();
  }

  async addAlbum(id: string): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: {
        albums: {
          connect: {
            id,
          },
        },
      },
    });
    return await this.findAll();
  }

  async removeAlbum(id: string): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: { albums: { disconnect: { id } } },
    });
    return await this.findAll();
  }

  async addArtist(id: string): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: {
        artists: {
          connect: {
            id,
          },
        },
      },
    });
    return await this.findAll();
  }

  async removeArtist(id: string): Promise<FavoritesResponse> {
    const favorite = await this.getFavoriteOrCreate();
    await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: { artists: { disconnect: { id } } },
    });
    return await this.findAll();
  }

  private async getFavoriteOrCreate() {
    const favorite = await this.prisma.favorite.findFirst();
    if (!favorite) {
      return this.prisma.favorite.create({
        data: {
          albums: {},
          artists: {},
          tracks: {},
        },
      });
    }
    return favorite;
  }
}
