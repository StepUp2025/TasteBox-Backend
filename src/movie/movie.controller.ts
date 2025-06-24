import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('movies')
@ApiTags('Movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('now-playing')
  @ApiOperation({
    summary: '상영 중인 영화 리스트를 조회',
    description: '현재 상영 중인 영화 리스트를 조회합니다.',
  })
  async getNowPlayingMovies(
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getNowPlayingMovies(page);
  }

  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 영화 리스트 조회',
    description: '평점이 높은 영화 리스트를 조회합니다.',
  })
  async getTopRatedMovies(
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getTopRatedMovies(page);
  }

  @Get(':movieId')
  @ApiOperation({
    summary: '영화 상세 정보 조회',
    description: '영화 ID를 통해 영화의 상세 정보를 조회합니다.',
  })
  async getMovieById(
    @Param('movieId') movieId: number,
  ): Promise<FindMovieDetailResponseDto> {
    return this.movieService.getMovieById(movieId);
  }

  @Get('')
  @ApiOperation({
    summary: '장르별 영화 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 영화 리스트를 조회합니다.',
  })
  async getMoviesByGenre(
    @Query('genreId') genreId: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getMoviesByGenre(genreId);
  }

  @Get(':movieId/recommends')
  @ApiOperation({
    summary: '추천 영화 리스트 조회',
    description: '영화 ID를 통해 추천 영화 리스트를 조회합니다.',
  })
  async getRecommendedMoviesById(
    @Param('movieId') movieId: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getRecommendedMoviesById(movieId);
  }
}
