import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

import { AddressParamsDto } from 'src/common/dtos/address-params.dto';

import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseManyUserDto, ResponseUserDto } from './dtos/response-user.dto';
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
  async getOneUserBalance(
    @Param() params: AddressParamsDto,
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.getUserBalance(params.address);
    return user;
  }

  @ApiOperation({
    summary: 'Get many users balance',
    description:
      'Fetch the user balance and profile information for all users.',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'The number of users to return',
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
    description: 'The number of users to skip',
  })
  @Get('balance')
  async getManyUserBalance(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<ResponseManyUserDto> {
    const users = await this.usersService.getManyUserBalance(limit, offset);
    return users;
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
