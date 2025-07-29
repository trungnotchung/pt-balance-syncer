import { Controller, Get, Param } from '@nestjs/common';

import { ResponseUserDto } from './dtos/response-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':address')
  async getUser(@Param('address') address: string): Promise<ResponseUserDto> {
    const user = await this.usersService.getUserBalance(address);
    return user;
  }
}
