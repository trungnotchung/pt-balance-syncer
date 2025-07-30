import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '12345678',
  })
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'trungnotchung',
  })
  username: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'The access token',
    example: '12345678',
  })
  accessToken: string;
}
