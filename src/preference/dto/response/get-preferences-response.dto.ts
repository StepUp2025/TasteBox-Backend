import { ApiProperty } from '@nestjs/swagger';
import { PreferenceDetailDto } from './preference-detail.dto';

export class GetPreferenceResponseDto {
  @ApiProperty({
    description: '영화 선호 장르 정보',
    type: PreferenceDetailDto,
  })
  movie: PreferenceDetailDto;

  @ApiProperty({
    description: 'TV 선호 장르 정보',
    type: PreferenceDetailDto,
  })
  tv: PreferenceDetailDto;
}
