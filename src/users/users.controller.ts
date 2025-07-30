import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseUserDto } from './dtos/response-user.dto';
import { UsersService } from './providers/users.service';
import { UserAccount } from './schemas/user-account.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':address')
  async getUser(@Param('address') address: string): Promise<ResponseUserDto> {
    const user = await this.usersService.getUserBalance(address);
    return user;
  }

  @Post('sign-up')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserAccount> {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }
}
