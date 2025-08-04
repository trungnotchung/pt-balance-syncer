import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationResponseDto {
  @ApiProperty({ description: 'The total number of items' })
  total: number;

  @ApiProperty({ description: 'The current page' })
  currentPage: number;

  @ApiProperty({ description: 'The number of items per page' })
  itemsPerPage: number;

  @ApiProperty({ description: 'The total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'The previous page' })
  @IsOptional()
  previousPage?: number;

  @ApiProperty({ description: 'The next page' })
  @IsOptional()
  nextPage?: number;
}
