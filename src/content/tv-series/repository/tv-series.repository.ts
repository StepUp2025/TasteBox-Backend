import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TvSeriesStatus } from 'src/content/enum/tv-series-status.enum';
import { Repository } from 'typeorm';
import { ContentNotFoundException } from '../../exception/content-not-found.exception';
import { TvSeries } from '../entities/tv-series.entity';

@Injectable()
export class TvSeriesRepository {
  // 전체 평균 평점 (C)
  private readonly GLOBAL_AVERAGE_RATING = 6.5;
  // 최소한의 투표 수 (m)
  private readonly MIN_VOTES_REQUIRED = 500;

  // 가중 평균 평점 계산 공식 문자열 상수화
  private readonly WEIGHTED_RATING_FORMULA =
    `(content.voteCount / (content.voteCount + ${this.MIN_VOTES_REQUIRED})) * content.voteAverage + ` +
    `(${this.MIN_VOTES_REQUIRED} / (content.voteCount + ${this.MIN_VOTES_REQUIRED})) * ${this.GLOBAL_AVERAGE_RATING}`;

  constructor(
    @InjectRepository(TvSeries)
    private readonly tvSeriesRepository: Repository<TvSeries>,
  ) {}

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
      .addOrderBy('content.firstAirDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 인기 있는 TV 시리즈 목록 조회
  async findPopularTvSeries(
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const queryBuilder = this.tvSeriesRepository
      .createQueryBuilder('content')
      .orderBy('content.popularity', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 평점 높은 TV 시리즈 목록 조회 (가중 평점 기반)
  async findTopRatedTvSeries(
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const queryBuilder = this.tvSeriesRepository
      .createQueryBuilder('content')
      .addSelect(this.WEIGHTED_RATING_FORMULA, 'weightedRating') // (selection: 계산식 문자열, alias: 별칭)
      .where('content.voteCount >= :minVoteCount', {
        minVoteCount: this.MIN_VOTES_REQUIRED,
      })
      .orderBy('weightedRating', 'DESC')
      .addOrderBy('content.voteCount', 'DESC')
      .addOrderBy('content.voteAverage', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 장르별 TV 시리즈 목록 조회
  async findTvSeriesByGenreIds(
    genreIds: number[],
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const queryBuilder = this.tvSeriesRepository
      .createQueryBuilder('content')
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('genre.id IN (:...genreIds)', { genreIds })
      .orderBy('content.voteAverage', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .distinctOn(['content.id']);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    console.log(results, totalCount);
    return [results, totalCount];
  }

  // 추천 TV 시리즈 목록 조회
  async findRecommendTvSeriesById(
    tvId: number,
    page: number,
    limit: number,
  ): Promise<[TvSeries[], number]> {
    const tvSeriesWithGenres = await this.getTvSeriesDetailById(tvId);
    const genres = tvSeriesWithGenres.contentGenres;
    if (!genres || genres.length === 0) return [[], 0];
    const genreIds = genres.map((cg) => cg.genre.id);
    const queryBuilder = this.tvSeriesRepository
      .createQueryBuilder('content')
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('content.id != :tvId', { tvId })
      .andWhere('genre.id IN (:...genreIds)', { genreIds })
      .orderBy('content.popularity', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .distinctOn(['content.id']);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }
}
