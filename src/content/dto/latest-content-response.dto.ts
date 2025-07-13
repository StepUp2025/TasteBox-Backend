import { ApiProperty } from '@nestjs/swagger';
import { ContentSummaryDto } from './content-summary.dto';

export class LatestContentsResponseDto {
  @ApiProperty({
    type: [ContentSummaryDto],
    description: '컨텐츠 요약 정보 배열',
  })
  contents: ContentSummaryDto[];

  @ApiProperty({
    type: Number,
    description: '컨텐츠 개수',
    example: 1,
  })
  count: number;

  constructor(contents: ContentSummaryDto[]) {
    this.contents = contents;
    this.count = contents.length;
  }
}
