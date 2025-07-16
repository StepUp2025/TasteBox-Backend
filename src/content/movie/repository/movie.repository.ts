import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentBaseRepository } from 'src/content/repository/content-base.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ContentNotFoundException } from './../../exception/content-not-found.exception';
import { Movie } from './../entities/movie.entity';

@Injectable()
export class MovieRepository extends ContentBaseRepository<Movie> {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    configService: ConfigService,
  ) {
    super(configService);
  }

  protected getRepository(): SelectQueryBuilder<Movie> {
    return this.movieRepository.createQueryBuilder('content');
  }

  // 영화 상세 조회
  async getMovieDetailById(id: number): Promise<Movie> {
    const result = await this.movieRepository.findOne({
      where: { id },
      relations: ['contentGenres.genre'],
    });
    if (!result) throw new ContentNotFoundException();
    return result;
  }

  // 상영 중인 영화 목록 조회
  async getNowPlayingMovies(
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const today = new Date();
    const sixWeeksAgo = new Date(today);
    sixWeeksAgo.setDate(today.getDate() - 6 * 7); // 6주 전
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3); // 3일 후

    const queryBuilder = this.movieRepository
      .createQueryBuilder('content')
      .where('content.releaseDate >= :sixWeeksAgo', {
        sixWeeksAgo: sixWeeksAgo.toISOString().split('T')[0],
      })
      .andWhere('content.releaseDate <= :threeDaysLater', {
        threeDaysLater: threeDaysLater.toISOString().split('T')[0],
      })
      .orderBy('content.releaseDate', 'DESC')
      .addOrderBy('content.popularity', 'DESC');

    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 인기 있는 영화 목록 조회 (findPopular 메서드 구현)
  public async findPopular(
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const queryBuilder = this.getRepository().orderBy(
      'content.popularity',
      'DESC',
    );
    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 평점 높은 영화 목록 조회 (findTopRated 메서드 구현)
  public async findTopRated(
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const globalAverageRating = this.configService.get<number>(
      'MOVIE_GLOBAL_AVERAGE_RATING',
      6.5,
    );
    const minVotesRequired = this.configService.get<number>(
      'MOVIE_MIN_VOTES_REQUIRED',
      500,
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

  // 장르별 영화 목록 조회
  async findMoviesByGenreIds(
    genreIds: number[],
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    return this.findByGenreIds(genreIds, page, limit);
  }

  // 추천 영화 목록 조회
  async findRecommendMoviesById(
    movieId: number,
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    return this.findRecommendById(
      movieId,
      page,
      limit,
      this.getMovieDetailById.bind(this),
    );
  }
}
