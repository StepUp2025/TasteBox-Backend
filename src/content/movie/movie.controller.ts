import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { InvalidPageException } from 'src/common/exceptions/invalid-page.exception';
import { GenrePaginationQueryDto } from './../dto/genre-pagination-query.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ContentNotFoundException } from './../exception/content-not-found.exception';
import { MovieDetailResponseDto } from './dto/movie-detail-response.dto';
import { MovieListResponseDto } from './dto/movie-list-response.dto';
import { MovieService } from './movie.service';

@Controller('movies')
@ApiTags('Movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // 상영 중인 영화 목록 조회
  @Get('now-playing')
  @ApiOperation({
    summary: '상영 중인 영화 목록 조회',
    description: '현재 상영 중인 영화 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '상영 중인 영화 목록 조회 성공',
    type: MovieListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getNowPlayingMovies(
    @Query() query: PaginationQueryDto,
  ): Promise<MovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getNowPlayingMovies(page, limit);
  }

  // 평점 높은 영화 목록 조회
  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 영화 목록 조회',
    description: '평점이 높은 영화 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '평점 높은 영화 목록 조회 성공',
    type: MovieListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getTopRatedMovies(
    @Query() query: PaginationQueryDto,
  ): Promise<MovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getTopRatedMovies(page, limit);
  }

  // 인기 있는 영화 목록 조회
  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 영화 목록 조회',
    description: '인기 있는 영화 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 영화 목록 조회 성공',
    type: MovieListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getPopularMovies(
    @Query() query: PaginationQueryDto,
  ): Promise<MovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getPopularMovies(page, limit);
  }

  // 장르별 영화 목록 조회
  @Get('')
  @ApiOperation({
    summary: '장르별 영화 목록 조회',
    description: '장르 ID를 통해 해당 장르의 영화 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 영화 목록 조회 성공',
    type: MovieListResponseDto,
  })
  @ApiQuery({
    name: 'genreId',
    isArray: true,
    type: Number,
    description: '장르 ID (여러 개 선택 가능)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidGenreIdException, InvalidPageException])
  async getMoviesByGenreIds(
    @Query() query: GenrePaginationQueryDto,
  ): Promise<MovieListResponseDto> {
    const { genreId, page, limit } = query;
    return this.movieService.getMoviesByGenreIds(genreId, page, limit);
  }

  // 추천 영화 목록 조회
  @Get(':movieId/recommends')
  @ApiOperation({
    summary: '추천 영화 목록 조회',
    description: '영화 ID를 통해 추천 영화 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 영화 목록 조회 성공',
    type: MovieListResponseDto,
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
    description: '페이지 번호 (기본값: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 반환 개수 (기본값: 20)',
    type: Number,
  })
  @CustomApiException(() => [InvalidPageException])
  async getRecommendedMoviesById(
    @Param('movieId') movieId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<MovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getRecommendedMoviesById(movieId, page, limit);
  }

  // 영화 상세 조회
  @Get(':movieId')
  @ApiOperation({
    summary: '영화 상세 정보 조회',
    description: '영화 ID를 통해 영화의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '영화 상세 정보 조회 성공',
    type: MovieDetailResponseDto,
  })
  @ApiParam({
    name: 'movieId',
    type: Number,
    required: true,
    description: '영화 ID',
  })
  @CustomApiException(() => [ContentNotFoundException])
  async getMovieById(
    @Param('movieId') movieId: number,
  ): Promise<MovieDetailResponseDto> {
    return this.movieService.findMovieById(movieId);
  }
}
