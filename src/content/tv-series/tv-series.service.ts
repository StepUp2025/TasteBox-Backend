import { Injectable } from '@nestjs/common';
import { TvSeriesDetailResponseDto } from './dto/tv-series-detail-response.dto';
import { TvSeriesListResponseDto } from './dto/tv-series-list-response.dto';
import { TvSeriesRepository } from './repository/tv-series.repository';
@Injectable()
export class TvSeriesService {
  constructor(private readonly tvSeroesRepository: TvSeriesRepository) {}

  // TV 시리즈 상세 정보 조회
  async findTvSeriesById(id: number): Promise<TvSeriesDetailResponseDto> {
    const tvSeriesContent =
      await this.tvSeroesRepository.getTvSeriesDetailById(id);
    const tvDetailDto = new TvSeriesDetailResponseDto(tvSeriesContent);
    return tvDetailDto;
  }

  // 방영 중인 TV 시리즈 조회
  async getOnTheAirTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeroesRepository.findOnTheAirTvSeries(page, limit);
    return new TvSeriesListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  // 인기 있는 TV 시리즈 조회
  async getPopularTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeroesRepository.findPopularTvSeries(page, limit);
    return new TvSeriesListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  // 높은 평점 TV 시리즈 조회
  async getTopRatedTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeroesRepository.findTopRatedTvSeries(page, limit);
    return new TvSeriesListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  // 특정 장르 TV 시리즈 조회
  async getTvSeriesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeroesRepository.findTvSeriesByGenreIds(
        genreIds,
        page,
        limit,
      );
    return new TvSeriesListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  // 추천 TV 시리즈 조회
  async getRecommendedTvSeriesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeroesRepository.findRecommendTvSeriesById(
        movieId,
        page,
        limit,
      );
    return new TvSeriesListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }
}
