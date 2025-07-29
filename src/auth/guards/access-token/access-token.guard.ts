import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constant';
import { jwtConfig } from 'src/config';
import { UserRole } from 'src/users/constants/user.constant';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from the context
    const request = context.switchToHttp().getRequest();
    // Extract the token from the request
    const token = this.extractTokenFromHeader(request);
    // If no token is found, return false
    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verifyAsync(
      token,
      this.jwtConfiguration,
    );

    const user = await this.usersService.findUserByUsername(payload.username);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        `User ${payload.username} does not have permission to access this resource`,
      );
    }

    request[REQUEST_USER_KEY] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
