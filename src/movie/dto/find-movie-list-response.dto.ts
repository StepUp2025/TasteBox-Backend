import { ApiProperty } from '@nestjs/swagger';
import type { TMDBNowPlayingResponse } from '../interfaces/movie-list.interface';
import { MovieListItemDto } from './movie-list-item.dto';

export class FindMovieListResponseDto {
  @ApiProperty({
    description: '콘텐츠 유형',
    example: 'movie',
  })
  contentType: string;

  @ApiProperty({
    description: '조회된 영화 목록',
    type: [MovieListItemDto],
    example: [
      {
        id: 157336,
        posterPath: '/example.jpg',
        title: '영화이름1',
      },
      { id: 123456, posterPath: '/abc.jpg', title: '영화이름2' },
    ],
  })
  movies: MovieListItemDto[];

  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  page: number;

  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  totalPages: number;

  constructor(movies: MovieListItemDto[], page: number, totalPages: number) {
    this.movies = movies;
    this.page = page;
    this.totalPages = totalPages;
  }

  static of(raw: TMDBNowPlayingResponse): FindMovieListResponseDto {
    return {
      contentType: 'movie',
      movies: raw.results.map(MovieListItemDto.of),
      page: raw.page,
      totalPages: raw.total_pages,
    };
  }
}
