import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { handleErrors } from '../utils/handleErrors';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto, required: true })
  @ApiResponse({
    status: 201,
    type: User,
    description: 'The user has been created.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await handleErrors(
      this.userService.findByName(createUserDto.login),
    );
    if (user) throw new BadRequestException('User already exists');

    return await handleErrors(this.userService.createUser(createUserDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return await handleErrors(this.userService.findAll());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Successful operation',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User> {
    const user = await handleErrors(this.userService.findById(id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('name/:login')
  @ApiOperation({ summary: 'Get user by login' })
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Successful operation',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  async findByName(@Param('login') login: string): Promise<User> {
    const user = await handleErrors(this.userService.findByName(login));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: "Update user's password" })
  @ApiBody({ type: UpdatePasswordDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated',
    type: User,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Old password is incorrect',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return await handleErrors(this.userService.update(id, updatePasswordDto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 204,
    description: 'User has been deleted.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.findById(id);
    return await handleErrors(this.userService.remove(id));
  }
}
