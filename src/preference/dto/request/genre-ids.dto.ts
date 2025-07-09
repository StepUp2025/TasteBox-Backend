import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GenreIdsDto {
  @ApiProperty({
    description: '장르 ID 목록',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsInt({ each: true })
  @Type(() => Number)
  genreIds: number[];
}
