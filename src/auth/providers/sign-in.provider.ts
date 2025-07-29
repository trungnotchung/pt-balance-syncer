import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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

      return `Login successful for ${user.username}`;
    } catch (error) {
      console.log(`Error signing in: ${error}`);
      throw error;
    }
  }
}
