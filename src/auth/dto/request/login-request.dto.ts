import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// login.dto.ts
export class LoginRequestDto {
  @ApiProperty({ description: '이메일', example: 'stepup@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: '1234qwer' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
