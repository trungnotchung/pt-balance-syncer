import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class StartSyncDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'address must be a valid Ethereum address',
  })
  address: string;

  @ApiProperty({
    description: 'The block number to start syncing from',
    example: 1234567890,
  })
  @IsString()
  @IsOptional()
  fromBlock?: string;
}
