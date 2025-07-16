import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from 'src/common/enums/content-type.enum';

export class ContentSummaryDto {
  @ApiProperty({ description: '콘텐츠 고유 ID', example: 101 })
  id: number;

  @ApiProperty({
    description: '포스터 이미지 경로 (없을 경우 null)',
    example: 'https://example.com/posters/dune2.jpg',
    nullable: true,
  })
  posterPath: string | null;

  @ApiProperty({ description: '콘텐츠 제목', example: '듄: 파트2' })
  title: string;

  @ApiProperty({
    description: '콘텐츠 타입 (movie: 영화, tv: TV 시리즈)',
    enum: ContentType,
    example: ContentType.MOVIE,
  })
  contentType: ContentType;

  constructor(partial: Partial<ContentSummaryDto>) {
    Object.assign(this, partial);
  }
}
