import { Injectable } from '@nestjs/common';

import { ResponseUserDto } from '../dtos/response-user.dto';

import { UserBalanceProvider } from './users-balance.provider';

@Injectable()
export class UsersService {
  constructor(private readonly userBalanceProvider: UserBalanceProvider) {}

  async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
    return this.userBalanceProvider.getUserBalance(userAddress);
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
}
