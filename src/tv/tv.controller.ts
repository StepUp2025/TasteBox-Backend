import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { ContentNotFoundException } from 'src/common/exceptions/content-not-found.exception';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import type { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import type { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import type { TvService } from './tv.service';

@Controller('tvs')
@ApiTags('Tvs')
export class TvController {
  constructor(private readonly tvService: TvService) {}

  @Get('now-playing')
  @ApiOperation({
    summary: '상영 중인 TV 시리즈 리스트를 조회',
    description: '현재 상영 중인 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '상영 중인 TV 시리즈 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [ExternalApiException, InvalidPageException])
  async getNowPlayingTv(
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getNowPlayingTvs(page);
  }

  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 TV 시리즈 리스트 조회',
    description: '평점이 높은 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '평점 높은 TV 시리즈 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [ExternalApiException, InvalidPageException])
  async getTopRatedTv(
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getTopRatedTvs(page);
  }

  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 TV 시리즈 리스트 조회',
    description: '인기 있는 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 TV 시리즈 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [ExternalApiException, InvalidPageException])
  async getPopularTv(
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getPopularTvs(page);
  }

  @Get('')
  @ApiOperation({
    summary: '장르별 TV 시리즈 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 영화 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'genreId',
    required: true,
    description: '장르 ID',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @CustomApiException(() => [
    ExternalApiException,
    ContentNotFoundException,
    InvalidGenreIdException,
    InvalidPageException,
  ])
  async getTvsByGenre(
    @Query('genreId') genreId: number,
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getTvsByGenre(genreId, page);
  }

  @Get(':tvId')
  @ApiOperation({
    summary: 'TV 시리즈 상세 정보 조회',
    description: 'TV 시리즈 ID를 통해 TV 시리즈의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'tvId',
    type: Number,
    required: true,
    description: 'TV 시리즈 ID',
  })
  @CustomApiException(() => [ExternalApiException, ContentNotFoundException])
  async getTvById(
    @Param('tvId') tvId: number,
  ): Promise<FindTvDetailResponseDto> {
    return this.tvService.getTvById(tvId);
  }

  @Get(':tvId/recommends')
  @ApiOperation({
    summary: '추천 TV 시리즈 리스트 조회',
    description: 'TV 시리즈 ID를 통해 추천 TV 시리즈 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 TV 시리즈 리스트 조회 성공',
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
    description: '페이지 번호',
    type: Number,
  })
  @CustomApiException(() => [
    ExternalApiException,
    ContentNotFoundException,
    InvalidPageException,
  ])
  async getRecommendedTvsById(
    @Param('tvId') tvId: number,
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getRecommendedTvsById(tvId, page);
  }
}
