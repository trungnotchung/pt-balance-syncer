import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SyncTransfer } from "./schemas/sync.schema";
import { Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import env from "src/config";
import { viemClient } from "./provider";
import { Address, erc20Abi, parseAbiItem } from "viem";

const BATCH_SIZE = 10;
const INTERVAL_MS = 10_000;
@Injectable()
export class SyncService {
	private isSyncing: boolean = false;

	constructor(
		@InjectModel(SyncTransfer.name)
		private readonly syncModel: Model<SyncTransfer>,
		private readonly usersService: UsersService
	) {}

	async startSync(): Promise<string> {
		if (this.isSyncing) {
			return 'Sync is already running';
		}
		this.isSyncing = true;
		setInterval(async () => {
				await this.syncNewTransferEvents();
		}, INTERVAL_MS).unref();
		return 'Sync started successfully';
	}

	private async syncNewTransferEvents() {
    try {
      const status = await this.syncModel.findOneAndUpdate(
        { address: env.contracts.pt.address },
        {},
        { upsert: true, new: true }
      );

      const fromBlock = BigInt(status.lastSyncedBlock || 0) + 1n;
      const latestBlock = await viemClient.getBlockNumber();
      const toBlock = fromBlock + BigInt(BATCH_SIZE) > latestBlock ? latestBlock : fromBlock + BigInt(BATCH_SIZE);
			if (fromBlock > toBlock) { // Data is up to date, do nothing
				return;
			}

      const logs = await viemClient.getLogs({
        address: env.contracts.pt.address as Address,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
        fromBlock,
        toBlock,
      });

			for (const log of logs) {
        const from = log.args.from.toLowerCase();
        const to = log.args.to.toLowerCase();
        const value = log.args.value.toString();
      }

      await this.syncModel.updateOne(
        { address: env.contracts.pt.address },
        { $set: {
					lastSyncedBlock: Number(toBlock), 
					updatedAt: new Date() } },
        { upsert: true }
      );

			console.log(`Synced blocks ${fromBlock} to ${toBlock}`);

    } catch (err) {
      console.error('Sync job error:', err);
    }
  }
}