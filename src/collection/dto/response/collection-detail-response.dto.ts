import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentSummaryDto } from './content-summary.dto';

export class CollectionDetailResponseDto {
  @ApiProperty({
    description: '컬렉션 고유 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '컬렉션 제목',
    example: '최고의 영화 & 시리즈 모음',
  })
  title: string;

  @ApiProperty({
    description: '컬렉션 대표 썸네일 이미지 URL',
    example: 'https://example.com/thumbnails/collection1.jpg',
  })
  thumbnail: string;

  @ApiPropertyOptional({
    description: '컬렉션 설명',
    example: '내가 좋아하는 영화랑 TV 시리즈!',
  })
  description?: string;

  @ApiProperty({
    description: '컬렉션에 포함된 콘텐츠 목록 (영화 또는 TV 시리즈만 가능)',
    type: [ContentSummaryDto],
  })
  contents: ContentSummaryDto[];

  constructor(partial: Partial<CollectionDetailResponseDto>) {
    Object.assign(this, partial);
  }
}
