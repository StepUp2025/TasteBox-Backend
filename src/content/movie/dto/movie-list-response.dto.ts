import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { ContentType } from 'src/common/enums/content-type.enum';
import { Movie } from './../entities/movie.entity';
import { MovieListItemDto } from './movie-list-item.dto';

interface MovieListResponseDtoParams {
  results: Movie[];
  page: number;
  limit: number;
  totalPages: number;
}

export class MovieListResponseDto {
  @Expose()
  @ApiProperty({
    description: '컨텐츠 타입',
    example: ContentType.MOVIE,
    enum: [ContentType.MOVIE],
  })
  contentType: ContentType.MOVIE;

  @Expose()
  @Type(() => MovieListItemDto)
  @ApiProperty({
    description: '조회된 영화 목록',
    type: [MovieListItemDto],
  })
  movies: MovieListItemDto[];

  @Expose()
  @ApiPropertyOptional({ description: '페이지 번호', example: 1 })
  page: number;

  @Expose()
  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  totalPages: number;

  constructor(params: MovieListResponseDtoParams) {
    this.contentType = ContentType.MOVIE;
    this.page = params.page;
    this.totalPages = params.totalPages;
    this.movies = plainToInstance(MovieListItemDto, params.results, {
      excludeExtraneousValues: true,
    });
  }
}
