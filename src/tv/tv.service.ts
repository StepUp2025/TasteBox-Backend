import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import { TMDBTvDetailResponse } from './interfaces/tv.interface';
import { TMDBTvListResponse } from './interfaces/tv-list.interface';

@Injectable()
export class TvService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // TV 시리즈 상세 정보 조회
  async getTvById(id: number): Promise<FindTvDetailResponseDto> {
    const url = buildTmdbUrl(`/tv/${id}`);
    const tmdbData = await fetchFromTmdb<TMDBTvDetailResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindTvDetailResponseDto.of(tmdbData);
  }

  // 상영 중인 TV 시리즈 조회
  async getNowPlayingTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/on_the_air', { page });
    const tmdbData = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindTvListResponseDto.of(tmdbData);
  }

  // 평점 높은 TV 시리즈 조회
  async getTopRatedTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/top_rated', { page });
    const tmdbData = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindTvListResponseDto.of(tmdbData);
  }

  // 인기 있는 TV 시리즈 조회
  async getPopularTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/popular', { page });
    const tmdbData = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindTvListResponseDto.of(tmdbData);
  }

  // 특정 장르 TV 시리즈 조회
  async getTvsByGenre(
    genreId: string[],
    page = 1,
  ): Promise<FindTvListResponseDto> {
    const genreIds = genreId.join('|');
    const url = buildTmdbUrl('/discover/tv', {
      with_genres: genreIds,
      page: page,
    });
    const tmdbData = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindTvListResponseDto.of(tmdbData);
  }

  // 추천 TV 시리즈 조회
  async getRecommendedTvsById(
    tvId: number,
    page = 1,
  ): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl(`/tv/${tvId}/recommendations`, {
      page: page,
    });
    const tmdbData = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );

    return FindTvListResponseDto.of(tmdbData);
  }
}
