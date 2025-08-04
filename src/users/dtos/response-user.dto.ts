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

export class ResponseManyUserDto {
  @ApiProperty({
    description: 'The total number of users',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'The users',
    type: [ResponseUserDto],
  })
  users: ResponseUserDto[];
}
