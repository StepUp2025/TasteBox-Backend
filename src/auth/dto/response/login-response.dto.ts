import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Access Token', type: String })
  accessToken: string;

  @ApiProperty({ description: '회원 기본 설정 완료 여부', type: Boolean })
  isPreferenceSet: boolean;
}
