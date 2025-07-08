import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ContentType } from 'src/common/types/content-type.enum';
import { Content } from 'src/content/entities/content.entity';
import { FindTvDetailResponseDto } from './dto/find-tv-detail-response.dto';
import { FindTvListResponseDto } from './dto/find-tv-list-response.dto';
import { TvListItemDto } from './dto/tv-list-item.dto';
import { TvRepository } from './repository/tv.repository';

@Injectable()
export class TvService {
  constructor(private readonly tvRepository: TvRepository) {}
  private createFindTvSeriesListResponseDto(
    results: Content[],
    totalCount: number,
    page: number,
    limit: number,
  ): FindTvListResponseDto {
    const totalPages = Math.ceil(totalCount / limit);
    const tvSeriesItems = plainToInstance(TvListItemDto, results, {
      excludeExtraneousValues: true,
    });
    const tvSeriesList = plainToInstance(
      FindTvListResponseDto,
      {
        contentType: ContentType.TV,
        tvs: tvSeriesItems,
        page: page,
        totalPages: totalPages,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return tvSeriesList;
  }

  // TV 시리즈 상세 정보 조회
  async findTvSeriesById(id: number): Promise<FindTvDetailResponseDto> {
    const tvSeriesContent = await this.tvRepository.findTvSeriesById(id);
    const tvDetailDto = new FindTvDetailResponseDto(tvSeriesContent);
    return tvDetailDto;
  }

  // 방영 중인 TV 시리즈 조회
  async getOnTheAirTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindTvListResponseDto> {
    const [results, totalCount] = await this.tvRepository.findOnTheAirTvSeries(
      page,
      limit,
    );
    return this.createFindTvSeriesListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 인기 있는 TV 시리즈 조회
  async getPopularTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindTvListResponseDto> {
    const [results, totalCount] = await this.tvRepository.findPopularTvSeries(
      page,
      limit,
    );
    return this.createFindTvSeriesListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 높은 평점 TV 시리즈 조회
  async getTopRatedTvSeries(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindTvListResponseDto> {
    const [results, totalCount] = await this.tvRepository.findTopRatedTvSeries(
      page,
      limit,
    );
    return this.createFindTvSeriesListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 특정 장르 TV 시리즈 조회
  async getTvSeriesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<FindTvListResponseDto> {
    const [results, totalCount] =
      await this.tvRepository.findTvSeriesByGenreIds(genreIds, page, limit);
    return this.createFindTvSeriesListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 추천 TV 시리즈 조회
  async getRecommendedTvSeriesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<FindTvListResponseDto> {
    const [results, totalCount] =
      await this.tvRepository.findRecommendTvSeriesById(movieId, page, limit);
    return this.createFindTvSeriesListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }
}
