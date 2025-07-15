import { Injectable } from '@nestjs/common';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { validatePageAndCreateListDto } from './../../common/utils/pagination.util';
import { GenreRepository } from './../../genre/repository/genre.repository';
import { TvSeriesDetailResponseDto } from './dto/tv-series-detail-response.dto';
import { TvSeriesListResponseDto } from './dto/tv-series-list-response.dto';
import { TvSeriesRepository } from './repository/tv-series.repository';

@Injectable()
export class TvSeriesService {
  constructor(
    private readonly tvSeriesRepository: TvSeriesRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  // TV 시리즈 상세 정보 조회
  async findTvSeriesById(id: number): Promise<TvSeriesDetailResponseDto> {
    const tvSeriesContent =
      await this.tvSeriesRepository.getTvSeriesDetailById(id);
    const tvDetailDto = new TvSeriesDetailResponseDto(tvSeriesContent);
    return tvDetailDto;
  }

  // 방영 중인 TV 시리즈 목록 조회
  async getOnTheAirTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeriesRepository.findOnTheAirTvSeries(page, limit);
    return validatePageAndCreateListDto(
      TvSeriesListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 인기 있는 TV 시리즈 목록 조회
  async getPopularTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] = await this.tvSeriesRepository.findPopular(
      page,
      limit,
    );
    return validatePageAndCreateListDto(
      TvSeriesListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 높은 평점 TV 시리즈 목록 조회
  async getTopRatedTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] = await this.tvSeriesRepository.findTopRated(
      page,
      limit,
    );
    return validatePageAndCreateListDto(
      TvSeriesListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 특정 장르 TV 시리즈 조회
  async getTvSeriesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const existingGenres = await this.genreRepository.getGenresByIds(genreIds);
    const existingGenreIds = existingGenres.map((genre) => genre.id);
    const invalidIds = genreIds.filter((id) => !existingGenreIds.includes(id));

    if (invalidIds.length > 0) {
      throw new InvalidGenreIdException(invalidIds);
    }
    const [results, totalCount] =
      await this.tvSeriesRepository.findTvSeriesByGenreIds(
        genreIds,
        page,
        limit,
      );

    return validatePageAndCreateListDto(
      TvSeriesListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 추천 TV 시리즈 목록 조회
  async getRecommendedTvSeriesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<TvSeriesListResponseDto> {
    const [results, totalCount] =
      await this.tvSeriesRepository.findRecommendTvSeriesById(
        movieId,
        page,
        limit,
      );
    return validatePageAndCreateListDto(
      TvSeriesListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }
}
