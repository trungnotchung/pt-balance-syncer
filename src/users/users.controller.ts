import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

import { AddressParamsDto } from 'src/common/dtos/address-params.dto';

import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseUserDto } from './dtos/response-user.dto';
import { UsersService } from './providers/users.service';
import { UserAccount } from './schemas/user-account.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get user balance by wallet address',
    description:
      'Fetch the user balance and profile information for a given Ethereum address.',
  })
  @ApiParam({
    name: 'address',
    description: 'Ethereum wallet address (0x-prefixed, 40 hex chars)',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @Get('balance/:address')
  async getUserBalance(
    @Param() params: AddressParamsDto,
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.getUserBalance(params.address);
    return user;
  }

  @ApiOperation({
    summary: 'Sign up a new user',
    description: 'Register a new user with a unique username and password.',
  })
  @ApiBody({ type: CreateUserDto, description: 'User registration data' })
  @Post('sign-up')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserAccount> {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }
}
