import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TvSeriesListItemDto {
  @Expose()
  @ApiProperty({ description: 'TV 시리즈 ID', example: 1399 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'TV 시리즈 제목', example: 'Game of Thrones' })
  title: string;

  @Expose()
  @ApiProperty({ description: '포스터 경로', example: '/example.jpg' })
  posterPath: string;
}
