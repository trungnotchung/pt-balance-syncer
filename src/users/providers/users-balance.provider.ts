import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, erc20Abi, formatUnits } from 'viem';

import env from 'src/config';
import { viemClient } from 'src/sync/provider';

import { ResponseUserDto } from '../dtos/response-user.dto';
import { UserBalance } from '../schemas/user-balance.schema';

@Injectable()
export class UserBalanceProvider {
  constructor(
    @InjectModel(UserBalance.name)
    private readonly userModel: Model<UserBalance>,
  ) {}

  private async getUserBalanceOnChain(userAddress: string): Promise<string> {
    const rawBalance = await viemClient.readContract({
      address: env.contracts.pt.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [userAddress as Address],
    });

    return formatUnits(rawBalance, 18);
  }

  async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
    const user = await this.userModel.findOne({ address: userAddress });

    if (!user) {
      const balance = await this.getUserBalanceOnChain(userAddress);
      return {
        address: userAddress,
        balance: balance,
      };
    }
    return {
      address: user.address,
      balance: user.balance,
    };
  }

  async updateUserBalance(
    userAddress: string,
    amount: bigint,
    isReceiver: boolean,
  ) {
    let user = await this.userModel.findOne({ address: userAddress });
    if (!user) {
      user = await this.userModel.create({
        address: userAddress,
        balance: '0',
      });
    }

    user.balance = (
      isReceiver ? BigInt(user.balance) + amount : BigInt(user.balance) - amount
    ).toString();
    await user.save();
  }
}
