import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AuthProvider } from 'src/user/enums/auth-provider.enum';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ description: '이메일', example: 'stepup@mail.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: '닉네임', example: '쌈뽕한닉네임' })
  @Expose()
  nickname: string;

  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  @Expose()
  contact: string;

  @ApiProperty({
    description: '사진',
    example: 'https://example.com/image.jpg',
  })
  @Expose()
  image: string;

  @ApiProperty({
    description: '가입 방식',
    enum: AuthProvider,
    example: AuthProvider.LOCAL, // 또는 'google', 'kakao' 등
  })
  @Expose()
  provider: AuthProvider;
}
