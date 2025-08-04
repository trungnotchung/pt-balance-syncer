import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import {
  ResponseManyUserDto,
  ResponseUserDto,
} from '../dtos/response-user.dto';
import { UserAccount } from '../schemas/user-account.schema';

import { UserAccountProvider } from './users-account.provider';
import { UserBalanceProvider } from './users-balance.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly userBalanceProvider: UserBalanceProvider,
    private readonly userAccountProvider: UserAccountProvider,
  ) {}

  async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
    return this.userBalanceProvider.getUserBalance(userAddress);
  }

  async getManyUserBalance(
    limit: number,
    offset: number,
  ): Promise<ResponseManyUserDto> {
    return this.userBalanceProvider.getManyUserBalance(limit, offset);
  }

  async updateUserBalance(
    userAddress: string,
    amount: bigint,
    isReceiver: boolean,
  ) {
    return this.userBalanceProvider.updateUserBalance(
      userAddress,
      amount,
      isReceiver,
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserAccount> {
    return this.userAccountProvider.createUser(createUserDto);
  }

  async findUserByUsername(username: string): Promise<UserAccount | undefined> {
    return this.userAccountProvider.findUserByUsername(username);
  }
}
