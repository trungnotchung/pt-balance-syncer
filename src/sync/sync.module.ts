import { Module } from "@nestjs/common";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Sync, SyncSchema } from "./schemas/sync.schema";

@Module({
	imports: [MongooseModule.forFeature([{ name: Sync.name, schema: SyncSchema }])],
	controllers: [SyncController],
	providers: [SyncService]
})
export class SyncModule {}