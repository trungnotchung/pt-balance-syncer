import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SyncTransfer } from "./schemas/sync.schema";
import { Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import env from "src/config";
import { viemClient } from "./provider";
import { Address, parseAbiItem } from "viem";

const BATCH_SIZE = 1000;
const INTERVAL_MS = 10_000;
@Injectable()
export class SyncService implements OnModuleInit {
	private syncTimer: NodeJS.Timeout | null = null;
	private isSyncing: boolean = false;

	constructor(
		@InjectModel(SyncTransfer.name)
		private readonly syncModel: Model<SyncTransfer>,
		private readonly usersService: UsersService
	) {}

	async onModuleInit() {
		await this.startSync();
	}

	async startSync(): Promise<string> {
		if (this.isSyncing) {
			return 'Sync is already running';
		}
		this.isSyncing = true;
		this.syncTimer = setInterval(async () => {
				await this.syncNewTransferEvents();
		}, INTERVAL_MS).unref();
		return 'Sync started successfully';
	}

	async stopSync(): Promise<string> {
		if (!this.syncTimer) {
			return 'Sync is not running';
		}
		clearInterval(this.syncTimer);
		this.syncTimer = null;
		this.isSyncing = false;
		return 'Sync stopped successfully';
	}

	private async syncNewTransferEvents() {
    try {
      const status = await this.syncModel.findOneAndUpdate(
        { address: env.contracts.pt.address },
        {},
        { upsert: true, new: true }
      );

      const fromBlock = status ? BigInt(status.lastSyncedBlock) + 1n : BigInt(env.contracts.pt.deployedBlock);
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
				console.log(`Transferring ${value} from ${from} to ${to}`);
				await this.usersService.updateUserBalance(from, BigInt(value), false);
				await this.usersService.updateUserBalance(to, BigInt(value), true);
      }

      await this.syncModel.updateOne(
        { address: env.contracts.pt.address },
        { $set: {
					lastSyncedBlock: Number(toBlock), 
					updatedAt: new Date() } },
        { upsert: true }
      );

			console.log(`Synced blocks ${fromBlock} to ${toBlock}, there are ${latestBlock - toBlock} blocks left`);

    } catch (err) {
      console.error('Sync job error:', err);
    }
  }

	async getSyncStatus(): Promise<string> {
		const syncStatus = await this.syncModel.findOne({ address: env.contracts.pt.address });
		if (!this.isSyncing) {
			return `Sync is not running, last synced block: ${syncStatus ? syncStatus.lastSyncedBlock : '0'}`;
		}
		return `Sync is running, last synced block: ${syncStatus ? syncStatus.lastSyncedBlock : '0'}`;
	}
}