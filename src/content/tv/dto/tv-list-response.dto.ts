import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { TvListItemDto } from './tv-list-item.dto';

export class TvListResponseDto {
  @Expose()
  @ApiProperty({
    description: '조회된 TV 프로그램 목록',
    type: [TvListItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TvListItemDto)
  tvs: TvListItemDto[];

  @Expose()
  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  @IsNumber()
  page: number;

  @Expose()
  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  @IsNumber()
  totalPages: number;
}
