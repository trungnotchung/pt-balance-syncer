import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
  private syncMap: Map<string, NodeJS.Timeout | null> = new Map();
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(SyncTransfer.name)
    private readonly syncModel: Model<SyncTransfer>,
    private readonly usersService: UsersService,
    private readonly onchainService: OnchainService,
  ) {}

  async onModuleInit() {
    try {
      await this.startSync(
        contractsConfig().pt.address,
        contractsConfig().pt.deployedBlock.toString(),
      );
    } catch (error) {
      this.logger.error('Failed to start sync on module init:', error);
    }
  }

  async startSync(address: string, fromBlock?: string): Promise<string> {
    try {
      if (this.syncMap.has(address)) {
        this.logger.warn(`Sync is already running for address ${address}`);
        return `Sync is already running for address ${address}`;
      }

      const syncStatus = await this.syncModel.findOneAndUpdate(
        { address },
        {
          $setOnInsert: {
            address,
            lastSyncedBlock: fromBlock || '0',
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

      this.logger.log(`Sync started successfully for address ${address}`);
      return `Sync started successfully for address ${address}`;
    } catch (error) {
      this.logger.error(`Failed to start sync for address ${address}:`, error);
      throw new Error(`Failed to start sync: ${error.message}`);
    }
  }

  async stopSync(address: string): Promise<string> {
    try {
      if (!this.syncMap.has(address)) {
        this.logger.warn(`Sync is not running for address ${address}`);
        return `Sync is not running for address ${address}`;
      }

      await this.syncModel.findOneAndUpdate(
        { address },
        {
          $set: {
            status: SyncStatus.STOPPED,
            updatedAt: new Date(),
          },
        },
      );

      const timer = this.syncMap.get(address);
      if (timer) {
        clearInterval(timer);
      }
      this.syncMap.delete(address);
      this.logger.log(`Sync stopped successfully for address ${address}`);
      return `Sync stopped successfully for address ${address}`;
    } catch (error) {
      this.logger.error(`Failed to stop sync for address ${address}:`, error);
      throw new Error(`Failed to stop sync: ${error.message}`);
    }
  }

  private async syncNewTransferEvents(address: string) {
    try {
      const status = await this.syncModel.findOne({ address });
      if (!status) {
        this.logger.error(`Sync status not found for address ${address}`);
        return;
      }

      // Safely convert string to BigInt
      const lastSyncedBlock = BigInt(status.lastSyncedBlock || '0');
      const fromBlock = lastSyncedBlock + 1n;

      const latestBlock = await this.onchainService.getLatestBlock();
      const toBlock =
        fromBlock + BigInt(BATCH_SIZE) > latestBlock
          ? latestBlock
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
        try {
          const from = log.args?.from?.toLowerCase();
          const to = log.args?.to?.toLowerCase();
          const value = log.args?.value?.toString();

          if (!from || !to || !value) {
            this.logger.warn('Invalid log data:', log);
            continue;
          }

          this.logger.log(
            `Address ${address} transferring ${value} from ${from} to ${to}`,
          );
          await this.usersService.updateUserBalance(from, BigInt(value), false);
          await this.usersService.updateUserBalance(to, BigInt(value), true);
        } catch (logError) {
          this.logger.error(
            `Error processing log for address ${address}:`,
            logError,
          );
        }
      }

      // Update sync status
      await this.syncModel.updateOne(
        { address },
        {
          $set: {
            lastSyncedBlock: toBlock.toString(),
            updatedAt: new Date(),
          },
        },
      );

      this.logger.log(
        `Address ${address} synced ${logs.length} logs from block ${fromBlock} to ${toBlock}`,
      );
    } catch (error) {
      this.logger.error(`Sync job error for address ${address}:`, error);
    }
  }

  async getSyncStatus(address: string): Promise<SyncResponseDto> {
    try {
      const syncStatus = await this.syncModel.findOne({ address });
      if (!syncStatus) {
        throw new NotFoundException(
          `Sync status not found for address ${address}`,
        );
      }

      const latestBlock = await this.onchainService.getLatestBlock();
      const lastSyncedBlock = BigInt(syncStatus.lastSyncedBlock || '0');
      const blocksRemaining =
        latestBlock > lastSyncedBlock ? latestBlock - lastSyncedBlock : 0n;

      return {
        id: syncStatus._id.toString(),
        ptAddress: syncStatus.address,
        lastSyncedBlock: syncStatus.lastSyncedBlock,
        blocksRemaining: blocksRemaining.toString(),
        status: syncStatus.status,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get sync status for address ${address}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to retrieve sync status');
    }
  }
}
