import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InMemoryDB } from 'src/IMDB';
import { v4 } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private db: InMemoryDB;
  constructor() {
    this.db = new InMemoryDB();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = v4();
    const version = 1;
    const createdAt = new Date();

    return this.db.save(`user.${id}`, {
      ...createUserDto,
      version,
      createdAt,
      id,
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.db.getAll('user');
  }

  async findById(id: string): Promise<User | null> {
    return this.db.get(`user.${id}`);
  }

  async findByName(name: string): Promise<User | null> {
    return this.db.findByUsername(name);
  }

  async update(id: string, user: User): Promise<User> {
    return this.db.update(`user.${id}`, user);
  }

  async remove(id: string): Promise<User | null> {
    return this.db.delete(`user.${id}`);
  }
}
