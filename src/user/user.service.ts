import { ForbiddenException, Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/IMDB';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = v4();
    const version = 1;
    const createdAt = new Date().getTime();
    return plainToInstance(
      User,
      this.db.save(`user.${id}`, { ...createUserDto, id, version, createdAt }),
    );
  }

  async findAll(): Promise<User[] | null> {
    return plainToInstance(User, this.db.getAll('user'));
  }

  async findById(id: string): Promise<User | null> {
    return plainToInstance(User, this.db.get(`user.${id}`));
  }

  async findByName(name: string): Promise<User | null> {
    return plainToInstance(User, this.db.findByUsername(name));
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.db.get(`user.${id}`);
    const version = user.version + 1;
    const updatedAt = new Date().getTime();
    const newUser = {
      ...user,
      version,
      updatedAt,
      password: newPassword,
    };
    if (user.password === oldPassword) {
      return plainToInstance(User, this.db.update(`user.${id}`, newUser));
    } else {
      throw new ForbiddenException('Old password is incorrect');
    }
  }

  async remove(id: string): Promise<User | null> {
    return plainToInstance(User, this.db.delete(`user.${id}`));
  }
}
