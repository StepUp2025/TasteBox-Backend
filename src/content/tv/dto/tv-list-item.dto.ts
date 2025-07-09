import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TvListItemDto {
  @Expose()
  @ApiProperty({ description: 'TV ID', example: 1399 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'TV 제목', example: 'Game of Thrones' })
  title: string;

  @Expose()
  @ApiProperty({ description: '포스터 경로', example: '/example.jpg' })
  posterPath: string;
}
