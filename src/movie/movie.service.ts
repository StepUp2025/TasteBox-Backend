import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TMDBNowPlayingResponse } from './type/movie-list';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { TMDBMovieDetailResponse } from './type/movie';

@Injectable()
export class MovieService {
  private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  private readonly TMDB_AUTH_HEADER = {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: 'application/json',
  };
  private readonly DEFAULT_LANGUAGE = 'ko-KR';

  constructor(private readonly httpService: HttpService) {}

  private buildUrl(
    path: string,
    query: Record<string, string | number> = {},
  ): string {
    const processedQuery: Record<string, string> = {};
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        processedQuery[key] = String(query[key]);
      }
    }

    processedQuery['language'] =
      processedQuery['language'] || this.DEFAULT_LANGUAGE;

    const queryString = new URLSearchParams(processedQuery).toString();
    return `${this.TMDB_BASE_URL}${path}${queryString ? '?' + queryString : ''}`;
  }

  private async fetchFromTmdb<T>(url: string): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.get<T>(url, {
        headers: this.TMDB_AUTH_HEADER,
      }),
    );
    return response.data;
  }

  // 영화 상세 정보 조회
  async getMovieById(id: number): Promise<FindMovieDetailResponseDto> {
    const url = this.buildUrl(`/movie/${id}`);
    const tmdbResponse = await this.fetchFromTmdb<TMDBMovieDetailResponse>(url);
    return FindMovieDetailResponseDto.fromTMDB(tmdbResponse);
  }

  // 상영 중인 영화 조회
  async getNowPlayingMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = this.buildUrl('/movie/now_playing', { page });
    const tmdbResponse = await this.fetchFromTmdb<TMDBNowPlayingResponse>(url);
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }

  // 평점 높은 영화 조회
  async getTopRatedMovies(page = 1): Promise<FindMovieListResponseDto> {
    const url = this.buildUrl('/movie/top_rated', { page });
    const tmdbResponse = await this.fetchFromTmdb<TMDBNowPlayingResponse>(url);
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }

  // 특정 장르 영화 조회
  async getMoviesByGenre(
    genreId: number,
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const url = this.buildUrl('/discover/movie', {
      with_genres: genreId,
      page: page,
    });
    const tmdbResponse = await this.fetchFromTmdb<TMDBNowPlayingResponse>(url);
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }

  // 추천 영화 조회
  async getRecommendedMoviesById(
    movieId: number,
    page = 1,
  ): Promise<FindMovieListResponseDto> {
    const url = this.buildUrl(`/movie/${movieId}/recommendations`, {
      page: page,
    });
    const tmdbResponse = await this.fetchFromTmdb<TMDBNowPlayingResponse>(url);
    return FindMovieListResponseDto.fromTMDBResponse(tmdbResponse);
  }
}
