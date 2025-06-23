import { TMDBNowPlayingResponse } from '../type/movie-list';
import { MovieListItemDto } from './movie-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindMovieListResponseDto {
  @ApiProperty({
    description: '조회된 영화 목록',
    type: [MovieListItemDto],
    example: [
      {
        id: 157336,
        poster_path: '/example.jpg',
        title: '영화이름1',
      },
      { id: 123456, poster_path: '/abc.jpg', title: '영화이름2' },
    ],
  })
  public movies: MovieListItemDto[];

  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  public page: number;

  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  public totalPages: number;

  constructor(movies: MovieListItemDto[], page: number, totalPages: number) {
    this.movies = movies;
    this.page = page;
    this.totalPages = totalPages;
  }

  static fromTMDBResponse(
    raw: TMDBNowPlayingResponse,
  ): FindMovieListResponseDto {
    const movies = raw.results.map((movie) =>
      MovieListItemDto.fromTMDBMovie(movie),
    );
    return new FindMovieListResponseDto(movies, raw.page, raw.total_pages);
  }
}
