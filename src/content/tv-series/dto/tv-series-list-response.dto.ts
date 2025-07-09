import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { TvSeriesListItemDto } from './tv-series-list-item.dto';

export class TvSeriesListResponseDto {
  @Expose()
  @ApiProperty({
    description: '조회된 TV 시리즈 목록',
    type: [TvSeriesListItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TvSeriesListItemDto)
  tvs: TvSeriesListItemDto[];

  @Expose()
  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  @IsNumber()
  page: number;

  @Expose()
  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  @IsNumber()
  totalPages: number;
}
