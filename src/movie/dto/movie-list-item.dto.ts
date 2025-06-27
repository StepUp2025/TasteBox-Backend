import { TMDBMovie } from '../interfaces/movie-list.interface';
import { ApiProperty } from '@nestjs/swagger';

export class MovieListItemDto {
  @ApiProperty({
    description: '영화 ID',
    example: 157336,
  })
  id: number;

  @ApiProperty({ description: '영화 제목', example: 'Interstellar' })
  title: string;

  @ApiProperty({
    description: '영화 포스터 이미지 URL',
    example: '/example.jpg',
  })
  poster_path: string;

  static of(this: void, raw: TMDBMovie): MovieListItemDto {
    return {
      id: raw.id,
      title: raw.title,
      poster_path: raw.poster_path,
    };
  }
}
