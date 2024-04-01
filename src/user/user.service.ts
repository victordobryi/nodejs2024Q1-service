import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return plainToInstance(
      User,
      await this.prisma.user.create({ data: createUserDto }),
    );
  }

  async findAll(): Promise<User[]> {
    return (await this.prisma.user.findMany()).map((user) =>
      plainToInstance(User, user),
    );
  }

  async findById(id: string): Promise<User | null> {
    return plainToInstance(
      User,
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      }),
    );
  }

  async findByName(login: string): Promise<User | null> {
    return plainToInstance(
      User,
      await this.prisma.user.findFirst({
        where: {
          login,
        },
      }),
    );
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== oldPassword)
      throw new ForbiddenException('Old password is incorrect');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: newPassword, version: user.version + 1 },
    });

    return plainToInstance(User, updatedUser);
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
