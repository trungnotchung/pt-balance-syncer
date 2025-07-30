import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { SyncStatus } from '../enums/sync-status.enum';

@Schema()
export class SyncTransfer extends Document {
  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true, default: '0' })
  lastSyncedBlock: string;

  @Prop({ required: true, default: SyncStatus.NOT_STARTED, enum: SyncStatus })
  status: SyncStatus;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const SyncTransferSchema = SchemaFactory.createForClass(SyncTransfer);
