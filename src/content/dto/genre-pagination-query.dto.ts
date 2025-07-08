import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationQueryDto } from 'src/content/dto/pagination-query.dto';

export class GenrePaginationQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: '장르 ID (단일 또는 다중)',
    type: [Number],
    isArray: true,
    example: [28, 12],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'genreId는 최소 하나의 요소를 포함해야 합니다.' })
  @IsNotEmpty({ message: 'genreId는 비어있을 수 없습니다.', each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((val) => Number(val));
    }
    if (typeof value === 'string') {
      return value.split(',').map((val) => Number(val));
    }
    return value;
  })
  genreId: number[];
}
