import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ContentType } from 'src/common/types/content-type.enum';
import { Content } from 'src/content/entities/content.entity';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { MovieListItemDto } from './dto/movie-list-item.dto';
import { MovieRepository } from './repository/movie.repository';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  private createFindMovieListResponseDto(
    results: Content[],
    totalCount: number,
    page: number,
    limit: number,
  ): FindMovieListResponseDto {
    const totalPages = Math.ceil(totalCount / limit);
    const movieItems = plainToInstance(MovieListItemDto, results, {
      excludeExtraneousValues: true,
    });
    const movieLists = plainToInstance(
      FindMovieListResponseDto,
      {
        contentType: ContentType.MOVIE,
        movies: movieItems,
        page: page,
        totalPages: totalPages,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    return movieLists;
  }

  // 영화 상세 정보 조회
  async findMovieById(id: number): Promise<FindMovieDetailResponseDto> {
    const movieContent = await this.movieRepository.findMovieById(id);
    const movieDetailDto = new FindMovieDetailResponseDto(movieContent);
    return movieDetailDto;
  }

  // 상영 중인 영화 조회
  async getNowPlayingMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindMovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.getNowPlayingMovies(page, limit);
    return this.createFindMovieListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 인기 있는 영화 조회
  async getPopularMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindMovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findPopularMovies(
      page,
      limit,
    );
    return this.createFindMovieListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 높은 평점 영화 조회
  async getTopRatedMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<FindMovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findTopRatedMovies(
      page,
      limit,
    );
    return this.createFindMovieListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 특정 장르 영화 조회
  async getMoviesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<FindMovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.findMoviesByGenreIds(genreIds, page, limit);
    return this.createFindMovieListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }

  // 추천 영화 조회
  async getRecommendedMoviesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<FindMovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.findRecommendMoviesById(movieId, page, limit);
    return this.createFindMovieListResponseDto(
      results,
      totalCount,
      page,
      limit,
    );
  }
}
