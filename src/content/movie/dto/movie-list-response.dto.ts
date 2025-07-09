import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ContentType } from 'src/common/enums/content-type.enum';
import { MovieListItemDto } from './movie-list-item.dto';

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
}
