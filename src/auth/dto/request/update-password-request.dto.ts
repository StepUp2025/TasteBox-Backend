import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordRequestDto {
  @ApiProperty({
    description: '기존 비밀번호',
    example: 'currentPassword123!',
  })
  @IsNotEmpty({ message: '기존 비밀번호를 입력해주세요.' })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: '새 비밀번호',
    example: 'newPassword456!',
  })
  @IsNotEmpty({ message: '새 비밀번호를 입력해주세요.' })
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: '새 비밀번호 확인',
    example: 'newPassword456!',
  })
  @IsNotEmpty({ message: '새 비밀번호 확인을 입력해주세요.' })
  @IsString()
  newPasswordConfirm: string;
}
