import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constant';
import { JwtPayload } from 'src/auth/constants/jwt-payload.constant';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { jwtConfig } from 'src/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly reflector: Reflector,
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
    const payload: JwtPayload = await this.jwtService.verifyAsync(
      token,
      this.jwtConfiguration,
    );
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles.includes(payload.role)) {
      throw new UnauthorizedException(
        `User ${payload.username} does not have permission to access this resource`,
      );
    }
    request[REQUEST_USER_KEY] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
