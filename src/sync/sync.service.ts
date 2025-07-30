import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parseAbiItem } from 'viem';

import { contractsConfig } from 'src/config';
import { OnchainService } from 'src/onchain/onchain.service';
import { UsersService } from 'src/users/providers/users.service';

import { SyncResponseDto } from './dtos/sync-response.dto';
import { SyncStatus } from './enums/sync-status.enum';
import { SyncTransfer } from './schemas/sync.schema';

const BATCH_SIZE = 1000;
const INTERVAL_MS = 10_000;
@Injectable()
export class SyncService implements OnModuleInit {
  private syncMap: Map<string, NodeJS.Timeout | null>;

  constructor(
    @InjectModel(SyncTransfer.name)
    private readonly syncModel: Model<SyncTransfer>,
    private readonly usersService: UsersService,
    private readonly onchainService: OnchainService,
  ) {
    this.syncMap = new Map();
  }

  async onModuleInit() {
    await this.startSync(
      contractsConfig().pt.address,
      contractsConfig().pt.deployedBlock,
    );
  }

  async startSync(address: string, fromBlock?: string): Promise<string> {
    if (this.syncMap.has(address)) {
      return `Sync is already running for address ${address}`;
    }
    const syncStatus = await this.syncModel.findOneAndUpdate(
      { address },
      {
        $setOnInsert: {
          lastSyncedBlock: '0',
          status: SyncStatus.NOT_STARTED,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );
    syncStatus.lastSyncedBlock = fromBlock || '0';
    syncStatus.status = SyncStatus.SYNCING;
    await syncStatus.save();

    this.syncMap.set(
      address,
      setInterval(async () => {
        await this.syncNewTransferEvents(address);
      }, INTERVAL_MS).unref(),
    );

    return `Sync started successfully for address ${address}`;
  }

  async stopSync(address: string): Promise<string> {
    if (!this.syncMap.has(address)) {
      return `Sync is not running for address ${address}`;
    }

    await this.syncModel.findOneAndUpdate(
      { address },
      {
        $set: {
          status: SyncStatus.STOPPED,
        },
      },
    );

    clearInterval(this.syncMap.get(address));
    this.syncMap.delete(address);
    return `Sync stopped successfully for address ${address}`;
  }

  private async syncNewTransferEvents(address: string) {
    try {
      const latestBlock = await this.onchainService.getLatestBlock();
      const status = await this.syncModel.findOne({ address });
      if (!status) {
        throw new Error(`Sync status not found for address ${address}`);
      }
      const fromBlock = BigInt(status.lastSyncedBlock) + 1n;
      const toBlock =
        fromBlock + BigInt(BATCH_SIZE) > latestBlock
          ? BigInt(latestBlock)
          : fromBlock + BigInt(BATCH_SIZE);
      if (fromBlock > toBlock) {
        return;
      }

      const logs = await this.onchainService.getLogs(
        contractsConfig().pt.address,
        parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)',
        ),
        fromBlock,
        toBlock,
      );

      for (const log of logs) {
        const from = log.args.from.toLowerCase();
        const to = log.args.to.toLowerCase();
        const value = log.args.value.toString();
        console.log(`Transferring ${value} from ${from} to ${to}`);
        await this.usersService.updateUserBalance(from, BigInt(value), false);
        await this.usersService.updateUserBalance(to, BigInt(value), true);
      }

      await this.syncModel.updateOne(
        { address: contractsConfig().pt.address },
        {
          $set: {
            lastSyncedBlock: Number(toBlock),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      console.log(
        `Synced blocks ${fromBlock} to ${toBlock}, there are ${latestBlock - toBlock} blocks left`,
      );
    } catch (err) {
      console.error('Sync job error:', err);
    }
  }

  async getSyncStatus(address: string): Promise<SyncResponseDto> {
    const syncStatus = await this.syncModel.findOne({ address });
    console.log(syncStatus);
    if (!syncStatus) {
      throw new Error(`Sync status not found for address ${address}`);
    }
    const latestBlock = await this.onchainService.getLatestBlock();
    return {
      id: syncStatus._id.toString(),
      ptAddress: syncStatus.address,
      lastSyncedBlock: syncStatus.lastSyncedBlock,
      blocksRemaining: (
        latestBlock - BigInt(syncStatus.lastSyncedBlock)
      ).toString(),
      status: syncStatus.status,
    };
  }
}
