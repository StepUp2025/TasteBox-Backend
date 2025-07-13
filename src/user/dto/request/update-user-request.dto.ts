import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateUserRequestDto } from './create-user-request.dto';

export class UpdateUserProfileRequestDto extends PartialType(
  PickType(CreateUserRequestDto, ['nickname', 'contact', 'image'] as const),
) {
  @ApiProperty({ description: '닉네임', example: '쌈뽕한닉네임' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @IsString()
  @Length(2, 10, { message: '닉네임은 2~10자 사이로 입력해주세요.' })
  nickname: string;
}
