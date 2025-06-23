import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({ description: '이메일', example: 'stepup@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: '1234qwer' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', example: '쌈뽕한닉네임' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  @IsString()
  contact?: string;

  @ApiProperty({
    description: '사진',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  image?: string;
}
