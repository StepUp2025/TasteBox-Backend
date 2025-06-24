import { Controller, Get, Param, Query } from '@nestjs/common';
import { TvService } from './tv.service';
import { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@Controller('tvs')
@ApiTags('Tvs')
export class TvController {
  constructor(private readonly tvService: TvService) {}

  @Public()
  @Get('now-playing')
  @ApiOperation({
    summary: '상영 중인 TV 시리즈 리스트를 조회',
    description: '현재 상영 중인 TV 시리즈 리스트를 조회합니다.',
  })
  async getNowPlayingTv(
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getNowPlayingTvs(page);
  }

  @Public()
  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 TV 시리즈 리스트 조회',
    description: '평점이 높은 TV 시리즈 리스트를 조회합니다.',
  })
  async getTopRatedTv(
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getTopRatedTvs(page);
  }

  @Public()
  @Get(':tvId')
  @ApiOperation({
    summary: 'TV 시리즈 상세 정보 조회',
    description: 'TV 시리즈 ID를 통해 TV 시리즈의 상세 정보를 조회합니다.',
  })
  async getTvById(
    @Param('tvId') tvId: number,
  ): Promise<FindTvDetailResponseDto> {
    return this.tvService.getTvById(tvId);
  }

  @Public()
  @Get('')
  @ApiOperation({
    summary: '장르별 TV 시리즈 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 TV 시리즈 리스트를 조회합니다.',
  })
  async getTvsByGenre(
    @Query('genreId') genreId: number,
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getTvsByGenre(genreId, page);
  }

  @Public()
  @Get(':tvId/recommends')
  @ApiOperation({
    summary: '추천 TV 시리즈 리스트 조회',
    description: 'TV 시리즈 ID를 통해 추천 TV 시리즈 리스트를 조회합니다.',
  })
  async getRecommendedTvsById(
    @Param('tvId') tvId: number,
    @Query('page') page?: number,
  ): Promise<FindTvListResponseDto> {
    return this.tvService.getRecommendedTvsById(tvId, page);
  }
}
