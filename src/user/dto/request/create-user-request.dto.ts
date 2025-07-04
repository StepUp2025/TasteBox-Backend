import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';

export class CreateUserRequestDto {
  @ApiProperty({ description: '이메일', example: 'stepup@mail.com' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: '1234qwer' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()\-=+[\]{};:'",.<>/?\\|`~]{6,20}$/, {
    message:
      '비밀번호는 6~20자 사이여야 하며, 공백 없이 영문, 숫자, 특수문자만 사용할 수 있어요.',
  })
  password: string;

  @ApiProperty({ description: '닉네임', example: '쌈뽕한닉네임' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @IsString()
  @Length(2, 10, { message: '닉네임은 2~10자 사이로 입력해주세요.' })
  nickname: string;

  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  @IsNotEmpty({ message: '휴대폰 번호를 입력해주세요.' })
  @IsString()
  @Matches(/^01[016789]\d{7,8}$/, {
    message: '휴대폰 번호는 숫자만 9~11자리로 입력해주세요.',
  })
  contact?: string;

  @ApiProperty({
    description: '사진',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: '가입 경로',
    enum: AuthProvider,
    example: AuthProvider.LOCAL,
  })
  @IsEnum(AuthProvider, { message: '가입 경로가 올바르지 않습니다.' })
  provider?: AuthProvider;
}
