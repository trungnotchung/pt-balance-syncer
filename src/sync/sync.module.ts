import { Module } from "@nestjs/common";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SyncTransfer, SyncTransferSchema } from "./schemas/sync.schema";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [MongooseModule.forFeature([{ name: SyncTransfer.name, schema: SyncTransferSchema }]), UsersModule],
	controllers: [SyncController],
	providers: [SyncService]
})
export class SyncModule {}