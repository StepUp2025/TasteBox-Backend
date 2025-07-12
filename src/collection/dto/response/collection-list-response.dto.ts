import { ApiProperty } from '@nestjs/swagger';
import { CollectionSummaryDto } from './collection-summary.dto';

export class CollectionListResponseDto {
  @ApiProperty({
    description: '컬렉션 요약 정보 배열',
    type: [CollectionSummaryDto],
  })
  collections: CollectionSummaryDto[];

  @ApiProperty({
    description: '컬렉션 총 개수',
    example: 3,
  })
  count: number;

  constructor(partial: Partial<CollectionListResponseDto>) {
    Object.assign(this, partial);
  }
}
