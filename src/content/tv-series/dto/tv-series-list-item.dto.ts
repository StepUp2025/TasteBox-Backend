import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { TvSeries } from '../entities/tv-series.entity';

export class TvSeriesListItemDto {
  @Expose()
  @ApiProperty({ description: 'TV 시리즈 ID', example: 1399 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'TV 시리즈 제목', example: 'Game of Thrones' })
  @Transform(({ obj }: { obj: TvSeries }) => obj.displayTitle, {
    toClassOnly: true,
  })
  title: string;

  @Expose()
  @ApiProperty({ description: '포스터 경로', example: '/example.jpg' })
  posterPath: string;
}
