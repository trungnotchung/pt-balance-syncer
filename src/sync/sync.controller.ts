import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/access-token/roles.guard';
import { UserRole } from 'src/users/constants/user.constant';

import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @ApiBearerAuth('bearer')
  @UseGuards(RoleGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({
    summary: 'Start the sync event',
    description: 'Start syncing the data from the blockchain',
  })
  @Post('start')
  async startSync() {
    return await this.syncService.startSync();
  }

  @ApiBearerAuth('bearer')
  @UseGuards(RoleGuard)
  @Roles([UserRole.ADMIN])
  @ApiOperation({
    summary: 'Stop the sync event',
    description: 'Stop syncing the data from the blockchain',
  })
  @Post('stop')
  async stopSync() {
    return await this.syncService.stopSync();
  }

  @ApiBearerAuth('bearer')
  @UseGuards(RoleGuard)
  @Roles([UserRole.ADMIN, UserRole.USER])
  @ApiOperation({
    summary: 'Get the sync status',
    description: 'Get the status of the sync event',
  })
  @Get('status')
  async getSyncStatus() {
    return await this.syncService.getSyncStatus();
  }
}
