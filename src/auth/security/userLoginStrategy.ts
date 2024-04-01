import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class UserLoginStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'password' });
  }

  async validate(login: string, password: string) {
    const user = await this.authService.verifyUserCredentials({
      login,
      password,
    });

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    return user;
  }
}
