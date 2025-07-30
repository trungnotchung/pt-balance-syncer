import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ResponseUserDto {
  @ApiProperty({
    description: 'The address of the user',
    example: '0x1234567890123456789012345678901234567890',
  })
  address: string;

  @ApiProperty({
    description: 'The balance of the user',
    example: '1000000000000000000',
  })
  @Transform(({ value }) => value.toString())
  balance: string;
}
