import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import { GenrePaginationQueryDto } from '../dto/genre-pagination-query.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ContentNotFoundException } from '../exception/content-not-found.exception';
import { TvSeriesDetailResponseDto } from './dto/tv-series-detail-response.dto';
import { TvSeriesListResponseDto } from './dto/tv-series-list-response.dto';
import { TvSeriesService } from './tv-series.service';

@Controller('tvs')
@ApiTags('Tvs')
export class TvSeriesController {
  constructor(private readonly tvService: TvSeriesService) {}

  // 방영 중인 TV 시리즈 목록 조회
  @Get('on-the-air')
  @ApiOperation({
    summary: '상영 중인 TV 시리즈 목록 조회',
    description: '현재 상영 중인 TV 시리즈 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '상영 중인 TV 시리즈 목록 조회 성공',
    type: TvSeriesListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getNowPlayingTv(
    @Query() query: PaginationQueryDto,
  ): Promise<TvSeriesListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getOnTheAirTvSeries(page, limit);
  }

  // 평점 높은 TV 시리즈 목록 조회
  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 TV 시리즈 목록 조회',
    description: '평점이 높은 TV 시리즈 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '평점 높은 TV 시리즈 목록 조회 성공',
    type: TvSeriesListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getTopRatedTv(
    @Query() query: PaginationQueryDto,
  ): Promise<TvSeriesListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getTopRatedTvSeries(page, limit);
  }

  // 인기 있는 TV 시리즈 목록 조회
  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 TV 시리즈 목록 조회',
    description: '인기 있는 TV 시리즈 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 TV 시리즈 목록 조회 성공',
    type: TvSeriesListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getPopularTvSeries(
    @Query() query: PaginationQueryDto,
  ): Promise<TvSeriesListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getPopularTvSeries(page, limit);
  }

  // 장르별 TV 시리즈 목록 조회
  @Get('')
  @ApiOperation({
    summary: '장르별 TV 시리즈 목록 조회',
    description: '장르 ID를 통해 해당 장르의 TV 시리즈 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 TV 시리즈 목록 조회 성공',
    type: TvSeriesListResponseDto,
  })
  @ApiQuery({
    name: 'genreId',
    required: true,
    type: Number,
    description: '장르 ID (여러 개 선택 가능)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidGenreIdException, InvalidPageException])
  async getTvsByGenre(
    @Query() query: GenrePaginationQueryDto,
  ): Promise<TvSeriesListResponseDto> {
    const { genreId, page, limit } = query;
    return this.tvService.getTvSeriesByGenreIds(genreId, page, limit);
  }

  // 추천 TV 시리즈 목록 조회
  @Get(':tvId/recommends')
  @ApiOperation({
    summary: '추천 TV 시리즈 목록 조회',
    description: 'TV 시리즈 ID를 통해 추천 TV 시리즈 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 TV 시리즈 목록 조회 성공',
    type: TvSeriesListResponseDto,
  })
  @ApiParam({
    name: 'tvId',
    type: Number,
    required: true,
    description: 'TV 시리즈 ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [ContentNotFoundException, InvalidPageException])
  async getRecommendedTvsById(
    @Param('tvId') tvId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<TvSeriesListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getRecommendedTvSeriesById(tvId, page, limit);
  }

  // TV 시리즈 상세 조회
  @Get(':tvId')
  @ApiOperation({
    summary: 'TV 시리즈 상세 정보 조회',
    description: 'TV 시리즈 ID를 통해 TV 시리즈의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: 'TV 시리즈 상세 정보 조회 성공',
    type: TvSeriesDetailResponseDto,
  })
  @ApiParam({
    name: 'tvId',
    type: Number,
    required: true,
    description: 'TV 시리즈 ID',
  })
  @CustomApiException(() => [ContentNotFoundException])
  async getTvById(
    @Param('tvId') tvId: number,
  ): Promise<TvSeriesDetailResponseDto> {
    return this.tvService.findTvSeriesById(tvId);
  }
}
