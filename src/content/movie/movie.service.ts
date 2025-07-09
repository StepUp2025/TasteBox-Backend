// src/movie/movie.service.ts (이전과 동일)

import { Injectable } from '@nestjs/common';
import { MovieDetailResponseDto } from './dto/movie-detail-response.dto';
import { MovieListResponseDto } from './dto/movie-list-response.dto';
import { MovieRepository } from './repository/movie.repository';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async findMovieById(id: number): Promise<MovieDetailResponseDto> {
    const movieContent = await this.movieRepository.getMovieDetailById(id);
    const movieDetailDto = new MovieDetailResponseDto(movieContent);
    return movieDetailDto;
  }

  async getNowPlayingMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.getNowPlayingMovies(page, limit);
    return new MovieListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  async getPopularMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findPopularMovies(
      page,
      limit,
    );
    return new MovieListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  async getTopRatedMovies(
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] = await this.movieRepository.findTopRatedMovies(
      page,
      limit,
    );
    return new MovieListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  async getMoviesByGenreIds(
    genreIds: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.findMoviesByGenreIds(genreIds, page, limit);
    return new MovieListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }

  async getRecommendedMoviesById(
    movieId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<MovieListResponseDto> {
    const [results, totalCount] =
      await this.movieRepository.findRecommendMoviesById(movieId, page, limit);
    return new MovieListResponseDto({
      results,
      totalCount,
      page,
      limit,
    });
  }
}
