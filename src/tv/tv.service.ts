import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import { TMDBTvDetailResponse } from './interfaces/tv.interface';
import { TMDBTvListResponse } from './interfaces/tv-list.interface';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';

@Injectable()
export class TvService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // TV 시리즈 상세 정보 조회
  async getTvById(id: number): Promise<FindTvDetailResponseDto> {
    const url = buildTmdbUrl(`/tv/${id}`);
    const tmdbResponse = await fetchFromTmdb<TMDBTvDetailResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvDetailResponseDto.of(tmdbResponse.data!);
  }

  // 상영 중인 TV 시리즈 조회
  async getNowPlayingTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/on_the_air', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvListResponseDto.of(tmdbResponse.data!);
  }

  // 평점 높은 TV 시리즈 조회
  async getTopRatedTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/top_rated', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvListResponseDto.of(tmdbResponse.data!);
  }

  // 인기 있는 TV 시리즈 조회
  async getPopularTvs(page = 1): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/tv/popular', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvListResponseDto.of(tmdbResponse.data!);
  }

  // 특정 장르 TV 시리즈 조회
  async getTvsByGenre(
    genreId: number,
    page = 1,
  ): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl('/discover/tv', {
      with_genres: genreId,
      page: page,
    });
    const tmdbResponse = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvListResponseDto.of(tmdbResponse.data!);
  }

  // 추천 TV 시리즈 조회
  async getRecommendedTvsById(
    tvId: number,
    page = 1,
  ): Promise<FindTvListResponseDto> {
    const url = buildTmdbUrl(`/tv/${tvId}/recommendations`, {
      page: page,
    });
    const tmdbResponse = await fetchFromTmdb<TMDBTvListResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindTvListResponseDto.of(tmdbResponse.data!);
  }
}
