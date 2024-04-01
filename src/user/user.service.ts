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
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const password = await this.hashPassword(createUserDto.password);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
      },
    });
    return plainToInstance(User, user);
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
    const { newPassword, oldPassword } = updatePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = await compare(oldPassword, newPassword);

    if (!passwordMatch)
      throw new ForbiddenException('Old password is incorrect');

    const hashedPassword = await this.hashPassword(
      updatePasswordDto.newPassword,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, version: user.version + 1 },
    });

    return plainToInstance(User, updatedUser);
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(parseInt(process.env.CRYPT_SALT));
    return await hash(password, salt);
  }
}
