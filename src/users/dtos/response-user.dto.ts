import { Transform } from 'class-transformer';

export class ResponseUserDto {
  address: string;

  @Transform(({ value }) => value.toString())
  balance: string;
}
