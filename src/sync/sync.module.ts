import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OnchainModule } from 'src/onchain/onchain.module';
import { UsersModule } from 'src/users/users.module';

import { SyncService } from './providers/sync.service';
import { SyncTransfer, SyncTransferSchema } from './schemas/sync.schema';
import { SyncController } from './sync.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncTransfer.name, schema: SyncTransferSchema },
    ]),
    UsersModule,
    OnchainModule,
  ],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
