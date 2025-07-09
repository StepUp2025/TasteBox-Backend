import { ApiProperty } from '@nestjs/swagger';
import { GenreDto } from 'src/genre/dto/genre.dto';

export class PreferenceDetailDto {
  @ApiProperty({
    description: '선호 장르 목록',
    type: [GenreDto],
  })
  genres: GenreDto[];

  @ApiProperty({
    description: '선호 장르 개수',
    example: 3,
  })
  count: number;
}
