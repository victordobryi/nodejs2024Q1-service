import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = v4();
    const version = 1;
    const createdAt = new Date().getTime();
    return plainToInstance(
      User,
      this.db.save(`user.${id}`, {
        ...createUserDto,
        id,
        version,
        createdAt,
        updatedAt: createdAt,
      }),
    );
  }

  async findAll(): Promise<User[] | null> {
    return plainToInstance(User, this.db.getAll('user'));
  }

  async findById(id: string): Promise<User | null> {
    return plainToInstance(User, this.db.get(`user.${id}`));
  }

  async findByName(name: string): Promise<User | null> {
    return plainToInstance(User, this.db.findByProperty('user', 'login', name));
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.db.get(`user.${id}`);
    if (!user) throw new NotFoundException('User not found');
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
