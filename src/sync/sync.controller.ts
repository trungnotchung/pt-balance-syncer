import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/auth/guards/access-token/access-token.guard';

import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @UseGuards(AdminGuard)
  @Post('start')
  async startSync() {
    return await this.syncService.startSync();
  }

  @UseGuards(AdminGuard)
  @Post('stop')
  async stopSync() {
    return await this.syncService.stopSync();
  }

  @Get('status')
  async getSyncStatus() {
    return await this.syncService.getSyncStatus();
  }
}
