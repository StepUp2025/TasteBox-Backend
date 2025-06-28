import type { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import type { TMDBMovieDetailResponse } from './interfaces/movie.interface';
import type { TMDBNowPlayingResponse } from './interfaces/movie-list.interface';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 영화 상세 정보 조회
  async getMovieById(id: number): Promise<FindMovieDetailResponseDto> {
    const url = buildTmdbUrl(`/movie/${id}`);
    const tmdbResponse = await fetchFromTmdb<TMDBMovieDetailResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();

    return FindMovieDetailResponseDto.of(tmdbResponse.data!);
  }

  // 상영 중인 영화 조회
  async getNowPlayingMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/now_playing', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindMovieListResponseDto.of(tmdbResponse.data!);
  }

  // 평점 높은 영화 조회
  async getTopRatedMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/top_rated', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindMovieListResponseDto.of(tmdbResponse.data!);
  }

  // 인기 있는 영화 조회
  async getPopularMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/popular', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindMovieListResponseDto.of(tmdbResponse.data!);
  }

  // 특정 장르 영화 조회
  async getMoviesByGenre(
    genreId: number,
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/discover/movie', {
      with_genres: genreId,
      page: page,
    });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindMovieListResponseDto.of(tmdbResponse.data!);
  }

  // 추천 영화 조회
  async getRecommendedMoviesById(
    movieId: number,
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl(`/movie/${movieId}/recommendations`, {
      page: page,
    });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    if (tmdbResponse.error) throw new ExternalApiException();
    return FindMovieListResponseDto.of(tmdbResponse.data!);
  }
}
