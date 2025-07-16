import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TvSeriesStatus } from 'src/content/enum/tv-series-status.enum';
import { ContentBaseRepository } from 'src/content/repository/content-base.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ContentNotFoundException } from '../../exception/content-not-found.exception';
import { TvSeries } from '../entities/tv-series.entity';

@Injectable()
export class TvSeriesRepository extends ContentBaseRepository<TvSeries> {
  constructor(
    @InjectRepository(TvSeries)
    private readonly tvSeriesRepository: Repository<TvSeries>,
    configService: ConfigService,
  ) {
    super(configService);
  }

  protected getRepository(): SelectQueryBuilder<TvSeries> {
    return this.tvSeriesRepository.createQueryBuilder('content');
  }

  // TV 시리즈 상세 조회
  async getTvSeriesDetailById(id: number): Promise<TvSeries> {
    const result = await this.tvSeriesRepository.findOne({
      where: { id },
      relations: ['contentGenres.genre', 'tvSeasons'],
    });
    if (!result) throw new ContentNotFoundException();
    return result;
  }

  // 방영 중인 TV 시리즈 목록 조회
  async findOnTheAirTvSeries(
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const queryBuilder = this.tvSeriesRepository
      .createQueryBuilder('content')
      .where('content.status IN (:...status)', {
        status: [TvSeriesStatus.RETURNING_SERIES],
      })
      .orderBy('content.popularity', 'DESC')
      .addOrderBy('content.firstAirDate', 'DESC');

    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 인기 있는 TV 시리즈 목록 조회 (findPopular 메서드 구현)
  public async findPopular(
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const queryBuilder = this.getRepository().orderBy(
      'content.popularity',
      'DESC',
    );
    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 평점 높은 TV 시리즈 목록 조회 (findTopRated 메서드 구현)
  public async findTopRated(
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const globalAverageRating = this.configService.get<number>(
      'TV_SERIES_GLOBAL_AVERAGE_RATING',
      7.0,
    );
    const minVotesRequired = this.configService.get<number>(
      'TV_SERIES_MIN_VOTES_REQUIRED',
      300,
    );

    const weightedRatingFormula = this.getWeightedRatingFormula(
      globalAverageRating,
      minVotesRequired,
    );

    const queryBuilder = this.getRepository()
      .addSelect(weightedRatingFormula, 'weightedRating')
      .where('content.voteCount >= :minVoteCount', {
        minVoteCount: minVotesRequired,
      })
      .orderBy('weightedRating', 'DESC')
      .addOrderBy('content.voteCount', 'DESC')
      .addOrderBy('content.voteAverage', 'DESC');

    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 장르별 TV 시리즈 목록 조회
  async findTvSeriesByGenreIds(
    genreIds: number[],
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    return this.findByGenreIds(genreIds, page, limit);
  }

  // 추천 TV 시리즈 목록 조회 (
  async findRecommendTvSeriesById(
    tvId: number,
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    return this.findRecommendById(
      tvId,
      page,
      limit,
      this.getTvSeriesDetailById.bind(this),
    );
  }
}
