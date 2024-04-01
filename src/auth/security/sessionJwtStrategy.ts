import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import 'dotenv/config';

@Injectable()
export class SessionJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: {
    userId: string;
    login: string;
  }): Promise<{ userId: string; login: string }> {
    const { userId, login } = payload;
    if (!userId || !login) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId, login };
  }
}
