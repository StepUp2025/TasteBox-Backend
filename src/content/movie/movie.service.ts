import { Injectable } from '@nestjs/common';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { validatePageAndCreateListDto } from './../../common/utils/pagination.util';
import { GenreRepository } from './../../genre/repository/genre.repository';
import { MovieDetailResponseDto } from './dto/movie-detail-response.dto';
import { MovieListResponseDto } from './dto/movie-list-response.dto';
import { MovieRepository } from './repository/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  // 영화 상세 정보 조회
  async findMovieById(id: number): Promise<MovieDetailResponseDto> {
    const movieContent = await this.movieRepository.getMovieDetailById(id);
    const movieDetailDto = new MovieDetailResponseDto(movieContent);
    return movieDetailDto;
  }

  // 상영 중인 영화 목록 조회
  async getNowPlayingMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.getNowPlayingMovies(page, limit);
    return validatePageAndCreateListDto(
      MovieListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 인기 있는 영화 목록 조회
  async getPopularMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findPopular(
      page,
      limit,
    );
    return validatePageAndCreateListDto(
      MovieListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 높은 평점 영화 목록 조회
  async getTopRatedMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findTopRated(
      page,
      limit,
    );
    return validatePageAndCreateListDto(
      MovieListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 특정 장르 영화 목록 조회
  async getMoviesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const existingGenres = await this.genreRepository.getGenresByIds(genreIds);
    const existingGenreIds = existingGenres.map((genre) => genre.id);
    const invalidIds = genreIds.filter((id) => !existingGenreIds.includes(id));

    if (invalidIds.length > 0) {
      throw new InvalidGenreIdException(invalidIds);
    }
    const [results, totalCount] =
      await this.movieRepository.findMoviesByGenreIds(genreIds, page, limit);

    return validatePageAndCreateListDto(
      MovieListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }

  // 추천 영화 목록 조회
  async getRecommendedMoviesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.findRecommendMoviesById(movieId, page, limit);
    return validatePageAndCreateListDto(
      MovieListResponseDto,
      page,
      limit,
      results,
      totalCount,
    );
  }
}
