import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

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
}
