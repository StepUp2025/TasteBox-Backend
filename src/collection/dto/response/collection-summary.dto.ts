import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CollectionSummaryDto {
  @ApiProperty({
    description: '컬렉션 고유 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '컬렉션 제목',
    example: '내 영화 컬렉션',
  })
  title: string;

  @ApiProperty({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/image.jpg',
  })
  thumbnail: string;

  @ApiPropertyOptional({
    description: '컬렉션 설명',
    example: '좋아하는 영화 모음',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: '컨텐츠 ID의 배열',
    example: [1, 2, 3],
  })
  contents: number[];

  constructor(partial: Partial<CollectionSummaryDto>) {
    Object.assign(this, partial);
  }
}
