import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { contractsConfig } from 'src/config';
import { OnchainService } from 'src/onchain/onchain.service';

import {
  ResponseManyUserDto,
  ResponseUserDto,
} from '../dtos/response-user.dto';
import { UserBalance } from '../schemas/user-balance.schema';

@Injectable()
export class UserBalanceProvider {
  private readonly logger = new Logger(UserBalanceProvider.name);

  constructor(
    @InjectModel(UserBalance.name)
    private readonly userBalanceModel: Model<UserBalance>,
    private readonly onchainService: OnchainService,
  ) {}

  /**
   * If we have it in Mongo: return it.
   * Otherwise fall back to on-chain.
   */
  async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
    const user = await this.userBalanceModel.findOne({
      address: userAddress,
    });
    if (user) {
      return { address: user.address, balance: user.balance };
    }

    // fallback to on-chain lookup
    const onChainBalance = await this.onchainService.getUserBalanceOnChain(
      contractsConfig().pt.address,
      userAddress,
    );

    return { address: userAddress, balance: onChainBalance };
  }

  async getManyUserBalance(
    limit: number,
    offset: number,
  ): Promise<ResponseManyUserDto> {
    const [users, total] = await Promise.all([
      this.userBalanceModel.find().skip(offset).limit(limit),
      this.userBalanceModel.countDocuments(),
    ]);
    return {
      users: users.map((user) => ({
        address: user.address,
        balance: user.balance,
      })),
      total,
    };
  }

  async updateUserBalance(
    userAddress: string,
    amount: bigint,
    isReceiver: boolean,
  ): Promise<void> {
    const delta = isReceiver ? amount : -amount;

    try {
      // Get current balance or default to 0
      const user = await this.userBalanceModel.findOne({
        address: userAddress,
      });
      const currentBalance = user ? BigInt(user.balance || '0') : 0n;
      const newBalance = currentBalance + delta;

      await this.userBalanceModel.updateOne(
        { address: userAddress },
        {
          $set: { balance: newBalance.toString() },
        },
        { upsert: true },
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to update balance for ${userAddress}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        `Could not update balance for ${userAddress}`,
      );
    }
  }
}
