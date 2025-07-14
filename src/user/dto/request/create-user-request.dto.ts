import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(passwordConfirm: string, args: ValidationArguments) {
    const dto = args.object as CreateUserRequestDto;
    return dto.password === passwordConfirm;
  }

  defaultMessage() {
    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
  }
}

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

  @ApiProperty({
    description: '비밀번호 확인',
    example: '1234qwer',
    required: true,
  })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @IsString()
  @Validate(MatchPasswordConstraint)
  passwordConfirm?: string;

  @ApiProperty({ description: '닉네임', example: '쌈뽕한닉네임' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @IsString()
  @Length(2, 10, { message: '닉네임은 2~10자 사이로 입력해주세요.' })
  nickname: string;

  @ApiPropertyOptional({ description: '연락처', example: '01012345678' })
  @IsOptional()
  @IsString()
  @Matches(/^01[016789]\d{7,8}$/, {
    message: '휴대폰 번호는 숫자만 9~11자리로 입력해주세요.',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  contact?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '프로필 이미지 파일',
  })
  @IsOptional()
  image?: any;

  @ApiHideProperty()
  @IsOptional()
  @IsEnum(AuthProvider, { message: '가입 경로가 올바르지 않습니다.' })
  provider?: AuthProvider;
}
