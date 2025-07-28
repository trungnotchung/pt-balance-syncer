import { Controller, Get, Post } from "@nestjs/common";
import { SyncService } from "./sync.service";

@Controller('sync')
export class SyncController {
	constructor(private readonly syncService: SyncService) {}

	@Post('start')
	async startSync() {
		return await this.syncService.startSync();
	}
}