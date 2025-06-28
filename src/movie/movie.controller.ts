import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { ContentNotFoundException } from 'src/common/exceptions/content-not-found.exception';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import type { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import type { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import type { MovieService } from './movie.service';

@Controller('movies')
@ApiTags('Movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('now-playing')
  @ApiOperation({
    summary: '상영 중인 영화 리스트를 조회',
    description: '현재 상영 중인 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '상영 중인 영화 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException, ExternalApiException])
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
  @ApiOkResponse({
    description: '평점 높은 영화 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException, ExternalApiException])
  async getTopRatedMovies(
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getTopRatedMovies(page);
  }

  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 영화 리스트 조회',
    description: '인기 있는 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 영화 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException, ExternalApiException])
  async getPopularMovies(
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getPopularMovies(page);
  }

  @Get('')
  @ApiOperation({
    summary: '장르별 영화 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 영화 리스트 조회 성공',
  })
  @ApiQuery({
    name: 'genreId',
    required: true,
    description: '장르 ID',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @CustomApiException(() => [
    ExternalApiException,
    ContentNotFoundException,
    InvalidGenreIdException,
    InvalidPageException,
  ])
  async getMoviesByGenre(
    @Query('genreId') genreId: number,
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getMoviesByGenre(genreId, page);
  }

  @Get(':movieId')
  @ApiOperation({
    summary: '영화 상세 정보 조회',
    description: '영화 ID를 통해 영화의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '영화 상세 정보 조회 성공',
  })
  @ApiParam({
    name: 'movieId',
    type: Number,
    required: true,
    description: '영화 ID',
  })
  @CustomApiException(() => [ContentNotFoundException, ExternalApiException])
  async getMovieById(
    @Param('movieId') movieId: number,
  ): Promise<FindMovieDetailResponseDto> {
    return this.movieService.getMovieById(movieId);
  }

  @Get(':movieId/recommends')
  @ApiOperation({
    summary: '추천 영화 리스트 조회',
    description: '영화 ID를 통해 추천 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 영화 리스트 조회 성공',
  })
  @ApiParam({
    name: 'movieId',
    type: Number,
    required: true,
    description: '영화 ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @CustomApiException(() => [
    ExternalApiException,
    ContentNotFoundException,
    InvalidPageException,
  ])
  async getRecommendedMoviesById(
    @Param('movieId') movieId: number,
    @Query('page') page?: number,
  ): Promise<FindMovieListResponseDto> {
    return this.movieService.getRecommendedMoviesById(movieId, page);
  }
}
