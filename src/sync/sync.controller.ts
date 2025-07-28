import { Controller, Get, Post } from "@nestjs/common";
import { SyncService } from "./sync.service";

@Controller('sync')
export class SyncController {
	constructor(private readonly syncService: SyncService) {}

	@Post('start')
	async startSync() {
		return await this.syncService.startSync();
	}

	@Post('stop')
	async stopSync() {
		return await this.syncService.stopSync();
	}

	@Get('status')
	async getSyncStatus() {
		return await this.syncService.getSyncStatus();
	}
}