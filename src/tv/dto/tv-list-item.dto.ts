import { TMDBTvItem } from '../interfaces/tv-list.interface';
import { ApiProperty } from '@nestjs/swagger';

export class TvListItemDto {
  @ApiProperty({ description: 'TV ID', example: 1399 })
  id: number;

  @ApiProperty({ description: 'TV 제목', example: 'Game of Thrones' })
  title: string;

  @ApiProperty({ description: '포스터 경로', example: '/example.jpg' })
  poster_path: string;

  static of(raw: TMDBTvItem): TvListItemDto {
    return {
      id: raw.id,
      title: raw.name,
      poster_path: raw.poster_path,
    };
  }
}
