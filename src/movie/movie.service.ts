import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TMDBNowPlayingResponse } from './interfaces/movie-list.interface';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { TMDBMovieDetailResponse } from './interfaces/movie.interface';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { ConfigService } from '@nestjs/config';

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
    return FindMovieDetailResponseDto.fromTMDB(tmdbResponse);
  }

  // 상영 중인 영화 조회
  async getNowPlayingMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/now_playing', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }

  // 평점 높은 영화 조회
  async getTopRatedMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = buildTmdbUrl('/movie/top_rated', { page });
    const tmdbResponse = await fetchFromTmdb<TMDBNowPlayingResponse>(
      this.httpService,
      url,
      this.configService,
    );
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
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
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
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
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }
}
