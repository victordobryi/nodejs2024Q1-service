import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConfigFactory } from './jwtConfigFactory/jwtConfigFactory';
import { SessionJwtStrategy } from './security/sessionJwtStrategy';
import { UserLoginStrategy } from './security/userLoginStrategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({ useFactory: jwtConfigFactory }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserLoginStrategy,
    SessionJwtStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
