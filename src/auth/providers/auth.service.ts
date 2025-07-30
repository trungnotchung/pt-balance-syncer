import { Injectable } from '@nestjs/common';

import { SignInResponseDto } from '../dtos/signin-response.dto';
import { SignInDto } from '../dtos/signin.dto';

import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.signInProvider.signIn(signInDto);
  }
}
