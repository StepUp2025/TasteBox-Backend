import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: '현재 비밀번호',
    example: 'currentPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPassword456!',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: '새 비밀번호 확인',
    example: 'newPassword456!',
  })
  @IsNotEmpty()
  @IsString()
  newPasswordConfirm: string;
}
