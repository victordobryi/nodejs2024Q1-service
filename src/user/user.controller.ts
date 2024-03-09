import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Put,
  ParseUUIDPipe,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { handleErrors } from 'src/utils/handleErrors';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findByName(createUserDto.login);
    if (user) throw new BadRequestException('User already exists');
    return await handleErrors(this.userService.create(createUserDto));
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await handleErrors(this.userService.findAll());
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    const user = await handleErrors(this.userService.findById(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('name/:login')
  async findByName(@Param('login') login: string): Promise<User> {
    const user = await handleErrors(this.userService.findByName(login));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.findById(id);
    if (user.password === oldPassword) {
      return await handleErrors(
        this.userService.update(id, {
          ...user,
          password: newPassword,
        }),
      );
    } else {
      throw new ForbiddenException('Old password is incorrect');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    const deletedUser = await handleErrors(this.userService.remove(id));
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }
}
