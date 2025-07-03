import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { TMDBMovieDetailResponse } from './interfaces/movie.interface';
import { TMDBNowPlayingResponse } from './interfaces/movie-list.interface';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 영화 상세 정보 조회
  async getMovieById(id: number): Promise<FindMovieDetailResponseDto> {
    const url = buildTmdbUrl(`/movie/${id}`);
    const tmdbData = await fetchFromTmdb<TMDBMovieDetailResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieDetailResponseDto.of(tmdbData);
  }

  // 상영 중인 영화 조회
  async getNowPlayingMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/now_playing', { page });
    const tmdbData = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.of(tmdbData);
  }

  // 평점 높은 영화 조회
  async getTopRatedMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/top_rated', { page });
    const tmdbData = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.of(tmdbData);
  }

  // 인기 있는 영화 조회
  async getPopularMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/popular', { page });
    const tmdbData = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.of(tmdbData);
  }

  // 특정 장르 영화 조회
  async getMoviesByGenre(
    genreId: string[],
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const genreIds = genreId.join('|');
    const url = buildTmdbUrl('/discover/movie', {
      with_genres: genreIds,
      page: page,
    });
    const tmdbData = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );

    return FindMovieListResponseDto.of(tmdbData);
  }

  // 추천 영화 조회
  async getRecommendedMoviesById(
    movieId: number,
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl(`/movie/${movieId}/recommendations`, {
      page: page,
    });
    const tmdbData = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.of(tmdbData);
  }
}
