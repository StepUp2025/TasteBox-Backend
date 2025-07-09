import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieListItemDto {
  @Expose()
  @ApiProperty({
    description: '영화 ID',
    example: 157336,
  })
  id: number;

  @Expose()
  @ApiProperty({ description: '영화 제목', example: 'Interstellar' })
  title: string;

  @Expose()
  @ApiProperty({
    description: '영화 포스터 이미지 URL',
    example: '/example.jpg',
  })
  posterPath: string;
}
