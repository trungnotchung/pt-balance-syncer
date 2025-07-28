import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Sync extends Document {
	@Prop({ required: true, unique: true })
	address: string;

	@Prop({ required: true, default: 0 })
	lastSyncedBlock: number;

	@Prop({ required: true, default: Date.now })
	updatedAt: Date;
}

export const SyncSchema = SchemaFactory.createForClass(Sync);