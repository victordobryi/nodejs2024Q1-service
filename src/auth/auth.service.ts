import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

export interface User {
  id: string;
  login: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(user: User) {
    const tokens = await this.signTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { userId: user.id, login: user.login, ...tokens };
  }

  async registerUser(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  async verifyUserCredentials(loginDto: CreateUserDto): Promise<User | null> {
    const createUser = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });
    if (!createUser) return null;

    const passwordIsValid = await compare(
      loginDto.password,
      createUser.password,
    );
    return passwordIsValid ? createUser : null;
  }

  async refreshToken(dto: UpdateAuthDto) {
    const userToken = await this.prisma.token.findUnique({
      where: { refreshToken: dto.refreshToken },
    });
    if (!userToken) throw new ForbiddenException('Invalid refresh token');

    const createUser = await this.userService.findById(userToken.userId);
    await this.prisma.token.delete({ where: { userId: createUser.id } });

    const tokens = await this.signTokens(createUser.id, createUser.login);
    await this.updateRefreshToken(createUser.id, tokens.refreshToken);

    return tokens;
  }

  private async signTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        { userId, login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    ]);

    return { userId, login, accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }
}
