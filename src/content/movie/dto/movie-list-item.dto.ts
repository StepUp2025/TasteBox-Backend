import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Movie } from '../entities/movie.entity';

export class MovieListItemDto {
  @Expose()
  @ApiProperty({
    description: '영화 ID',
    example: 157336,
  })
  id: number;

  @Expose()
  @Transform(({ obj }: { obj: Movie }) => obj.displayTitle, {
    toClassOnly: true,
  })
  @ApiProperty({ description: '영화 제목', example: 'Interstellar' })
  title: string;

  @Expose()
  @ApiProperty({
    description: '영화 포스터 이미지 URL',
    example: '/example.jpg',
  })
  posterPath: string;
}
