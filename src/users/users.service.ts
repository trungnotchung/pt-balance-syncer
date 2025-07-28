import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { viemClient } from "src/sync/provider";
import env from "src/config";
import { Address, erc20Abi, formatUnits } from 'viem';
import { ResponseUserDto } from "./dtos/response-user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>
	) {}

	private async getUserBalanceOnChain(userAddress: string): Promise<string> {
		const rawBalance = await viemClient.readContract({
			address: env.contracts.pt.address as Address,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [userAddress as Address]
		})

		return formatUnits(rawBalance, 18);
	}

	async getUserBalance(userAddress: string): Promise<ResponseUserDto> {
		let user = await this.userModel.findOne({ address: userAddress });

		if (!user) {
			console.log('User not found, fetching balance from chain');
			const balance = await this.getUserBalanceOnChain(userAddress);
			user = new this.userModel({ address: userAddress, balance });
			await user.save();
		} else {
			console.log('User found, returning balance from database');
		}

		return {
			address: user.address,
			balance: user.balance
		};
	}
}
