import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from 'src/auth/constants/jwt-payload.constant';
import { UsersService } from 'src/users/providers/users.service';

import { SignInDto } from '../dtos/signin.dto';

import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    try {
      const user = await this.usersService.findUserByUsername(
        signInDto.username,
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isPasswordValid = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return accessToken;
    } catch (error) {
      console.log(`Error signing in: ${error}`);
      throw error;
    }
  }
}
