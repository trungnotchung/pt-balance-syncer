import { ApiProperty } from '@nestjs/swagger';

import { SyncStatus } from '../enums/sync-status.enum';

export class SyncResponseDto {
  @ApiProperty({
    description: 'The id of the sync',
    example: '12345678',
  })
  id: string;

  @ApiProperty({
    description: 'The address of the PT contract',
    example: '0x9f56094c450763769ba0ea9fe2876070c0fd5f77',
  })
  ptAddress: string;

  @ApiProperty({
    description: 'The current last synced block',
    example: 12345678,
  })
  lastSyncedBlock: number;

  @ApiProperty({
    description: 'The number of blocks remaining to be synced',
    example: 100,
  })
  blocksRemaining: number;

  @ApiProperty({
    description: 'The number of blocks remaining to be synced',
    example: 100,
  })
  status: SyncStatus;
}
