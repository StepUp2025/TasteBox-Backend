import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ContentType } from 'src/common/enums/content-type.enum';
import { TvSeries } from './../entities/tv-series.entity';
import { TvSeriesListItemDto } from './tv-series-list-item.dto';

interface TvSeriesListResponseDtoParams {
  results: TvSeries[];
  page: number;
  limit: number;
  totalPages: number;
}

export class TvSeriesListResponseDto {
  @Expose()
  @ApiProperty({
    description: '컨텐츠 타입',
    example: ContentType.TVSERIES,
    enum: [ContentType.TVSERIES],
  })
  contentType: ContentType.TVSERIES;

  @Expose()
  @ApiProperty({
    description: '조회된 TV 시리즈 목록',
    type: [TvSeriesListItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TvSeriesListItemDto)
  @ApiProperty({
    description: '조회된 TV 시리즈 목록',
    type: [TvSeriesListItemDto],
  })
  tvs: TvSeriesListItemDto[];

  @Expose()
  @ApiProperty({ description: '페이지 번호', example: 1 })
  @IsNumber()
  page: number;

  @Expose()
  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  @IsNumber()
  totalPages: number;

  constructor(params: TvSeriesListResponseDtoParams) {
    this.contentType = ContentType.TVSERIES;
    this.page = params.page;
    this.totalPages = params.totalPages;
    this.tvs = plainToInstance(TvSeriesListItemDto, params.results, {
      excludeExtraneousValues: true,
    });
  }
}
