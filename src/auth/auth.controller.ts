import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInDto,
  ): Promise<string> {
    return this.authService.signIn(signInDto);
  }
}
