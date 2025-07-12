import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class ContentsQueryDto {
  @ApiProperty({
    description:
      '추가할 컨텐츠의 ID (여러 개 전달 가능, 예: ?contentId=1&contentId=2)',
    required: true,
    type: Number,
    isArray: true,
    example: [2, 2001],
  })
  @IsArray()
  @ArrayMinSize(1, { message: '최소 하나의 컨텐츠를 선택해야합니다.' })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsNumber({}, { each: true })
  contentId: number[];
}
