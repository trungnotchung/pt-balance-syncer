import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { contractsConfig } from 'src/config';
import { OnchainService } from 'src/onchain/onchain.service';

import { ResponseUserDto } from '../dtos/response-user.dto';
import { UserBalance } from '../schemas/user-balance.schema';

@Injectable()
export class UserBalanceProvider {
  constructor(
    @InjectModel(UserBalance.name)
    private readonly userBalanceModel: Model<UserBalance>,
    private readonly onchainService: OnchainService,
  ) {}

  async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
    const user = await this.userBalanceModel.findOne({ address: userAddress });

    if (!user) {
      const balance = await this.onchainService.getUserBalanceOnChain(
        contractsConfig().pt.address,
        userAddress,
      );
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
    let user = await this.userBalanceModel.findOne({ address: userAddress });
    if (!user) {
      user = await this.userBalanceModel.create({
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
