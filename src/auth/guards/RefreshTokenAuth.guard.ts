import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request?.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }
    try {
      const secretKey = process.env.JWT_SECRET_REFRESH_KEY;
      await this.jwtService.verifyAsync(refreshToken, { secret: secretKey });
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token.');
    }
    return true;
  }
}
