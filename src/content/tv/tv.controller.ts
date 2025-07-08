import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import { GenrePaginationQueryDto } from '../dto/genre-pagination-query.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ContentNotFoundException } from './../exception/content-not-found.exception';
import { FindMovieDetailResponseDto } from './../movie/dto/find-movie-detail-response.dto';
import { FindMovieListResponseDto } from './../movie/dto/find-movie-list-response.dto';
import { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import { TvService } from './tv.service';

@Controller('tvs')
@ApiTags('Tvs')
export class TvController {
  constructor(private readonly tvService: TvService) {}

  @Get('on-the-air')
  @ApiOperation({
    summary: '상영 중인 TV 시리즈 리스트를 조회',
    description: '현재 상영 중인 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '상영 중인 TV 시리즈 리스트 조회 성공',
    type: FindTvListResponseDto,
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
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getOnTheAirTvSeries(page);
  }

  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 TV 시리즈 리스트 조회',
    description: '평점이 높은 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '평점 높은 TV 시리즈 리스트 조회 성공',
    type: FindTvListResponseDto,
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
  ): Promise<FindTvListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getTopRatedTvSeries(page, limit);
  }

  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 TV 시리즈 리스트 조회',
    description: '인기 있는 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 TV 시리즈 리스트 조회 성공',
    type: FindTvListResponseDto,
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
  ): Promise<FindTvListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getPopularTvSeries(page, limit);
  }

  @Get('')
  @ApiOperation({
    summary: '장르별 TV 시리즈 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 TV 시리즈 리스트 조회 성공',
    type: FindTvListResponseDto,
  })
  @ApiQuery({
    name: 'genreId',
    required: true,
    description: '장르 ID (DB 내부 ID)',
    type: [Number],
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
  async getTvsByGenre(
    @Query() query: GenrePaginationQueryDto,
  ): Promise<FindTvListResponseDto> {
    const { genreId, page, limit } = query;
    return this.tvService.getTvSeriesByGenreIds(genreId, page, limit);
  }

  @Get(':tvId')
  @ApiOperation({
    summary: 'TV 시리즈 상세 정보 조회',
    description: 'TV 시리즈 ID를 통해 TV 시리즈의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '영화 상세 정보 조회 성공',
    type: FindMovieDetailResponseDto,
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
  ): Promise<FindTvDetailResponseDto> {
    return this.tvService.findTvSeriesById(tvId);
  }

  @Get(':tvId/recommends')
  @ApiOperation({
    summary: '추천 TV 시리즈 리스트 조회',
    description: 'TV 시리즈 ID를 통해 추천 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 TV 시리즈 리스트 조회 성공',
    type: FindMovieListResponseDto,
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
  ): Promise<FindTvListResponseDto> {
    const { page, limit } = query;
    return this.tvService.getRecommendedTvSeriesById(tvId, page, limit);
  }
}
