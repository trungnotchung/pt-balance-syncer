import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';

import { SyncTransfer, SyncTransferSchema } from './schemas/sync.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SyncTransfer.name, schema: SyncTransferSchema },
    ]),
    UsersModule,
  ],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
