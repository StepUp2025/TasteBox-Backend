import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TvListItemDto } from './tv-list-item.dto';
import { TMDBTvListResponse } from '../interfaces/tv-list.interface';

export class FindTvListResponseDto {
  @ApiProperty({
    description: '조회된 TV 프로그램 목록',
    type: [TvListItemDto],
    example: [
      {
        id: 1396,
        poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
        title: '브레이킹 배드',
      },
      {
        id: 1398,
        poster_path: '/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg',
        title: '더 소프라노스',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TvListItemDto)
  tvs: TvListItemDto[];

  @ApiProperty({ description: '현재 페이지 번호', example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ description: '총 페이지 수', example: 1000 })
  @IsNumber()
  totalPages: number;

  constructor(tvs: TvListItemDto[], page: number, totalPages: number) {
    this.tvs = tvs;
    this.page = page;
    this.totalPages = totalPages;
  }

  static fromTMDBResponse(raw: TMDBTvListResponse): FindTvListResponseDto {
    const tvs = raw.results.map((tvItem) => TvListItemDto.fromTMDB(tvItem));

    return new FindTvListResponseDto(tvs, raw.page, raw.total_pages);
  }
}
