import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentNotFoundException } from './../../exception/content-not-found.exception';
import { Movie } from './../entities/movie.entity';

@Injectable()
export class MovieRepository {
  // 전체 평균 평점 (C)
  private readonly GLOBAL_AVERAGE_RATING = 6.5;
  // 최소한의 투표 수 (m)
  private readonly MIN_VOTES_REQUIRED = 500;

  // 가중 평균 평점 계산 공식 문자열 상수화
  private readonly WEIGHTED_RATING_FORMULA =
    `(content.voteCount / (content.voteCount + ${this.MIN_VOTES_REQUIRED})) * content.voteAverage + ` +
    `(${this.MIN_VOTES_REQUIRED} / (content.voteCount + ${this.MIN_VOTES_REQUIRED})) * ${this.GLOBAL_AVERAGE_RATING}`;

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

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
      }) // YYYY-MM-DD 형식으로 변환
      .andWhere('content.releaseDate <= :threeDaysLater', {
        threeDaysLater: threeDaysLater.toISOString().split('T')[0],
      }) // YYYY-MM-DD 형식으로 변환
      .orderBy('content.releaseDate', 'DESC')
      .addOrderBy('content.popularity', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 인기 있는 영화 목록 조회
  async findPopularMovies(
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const queryBuilder = this.movieRepository
      .createQueryBuilder('content')
      .orderBy('content.popularity', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 평점 높은 영화 목록 조회 (가중 평점 기반)
  async findTopRatedMovies(
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const queryBuilder = this.movieRepository
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

  // 장르별 영화 목록 조회
  async findMoviesByGenreIds(
    genreIds: number[],
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const queryBuilder = this.movieRepository
      .createQueryBuilder('content')
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('genre.id IN (:...genreIds)', { genreIds })
      .orderBy('content.voteAverage', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .distinctOn(['content.id']);

    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }

  // 추천 영화 목록 조회
  async findRecommendMoviesById(
    movieId: number,
    page: number,
    limit: number,
  ): Promise<[Movie[], number]> {
    const movieWithGenres = await this.getMovieDetailById(movieId);
    const genres = movieWithGenres.contentGenres;
    if (!genres || genres.length === 0) return [[], 0];
    const genreIds = genres.map((cg) => cg.genre.id);
    const queryBuilder = this.movieRepository
      .createQueryBuilder('content')
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('content.id != :movieId', { movieId })
      .andWhere('genre.id IN (:...genreIds)', { genreIds })
      .orderBy('content.popularity', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .distinctOn(['content.id']);
    const [results, totalCount] = await queryBuilder.getManyAndCount();
    return [results, totalCount];
  }
}
