import { Injectable } from '@nestjs/common';

import { SignInDto } from '../dtos/signin.dto';

import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    return this.signInProvider.signIn(signInDto);
  }
}
