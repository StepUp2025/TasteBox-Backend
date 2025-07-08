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
import { GenrePaginationQueryDto } from '../dto/genre-pagination-query.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ContentNotFoundException } from './../exception/content-not-found.exception';
import { FindMovieDetailResponseDto } from './dto/find-movie-detail-response.dto';
import { FindMovieListResponseDto } from './dto/find-movie-list-response.dto';
import { MovieService } from './movie.service';

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
    type: FindMovieListResponseDto,
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
  ): Promise<FindMovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getNowPlayingMovies(page, limit);
  }

  @Get('top-rated')
  @ApiOperation({
    summary: '평점 높은 영화 리스트 조회',
    description: '평점이 높은 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '평점 높은 영화 리스트 조회 성공',
    type: FindMovieListResponseDto,
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
  ): Promise<FindMovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getTopRatedMovies(page, limit);
  }

  @Get('popular')
  @ApiOperation({
    summary: '인기 있는 영화 리스트 조회',
    description: '인기 있는 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 있는 영화 리스트 조회 성공',
    type: FindMovieListResponseDto,
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
  ): Promise<FindMovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getPopularMovies(page, limit);
  }

  @Get('')
  @ApiOperation({
    summary: '장르별 영화 리스트 조회',
    description: '장르 ID를 통해 해당 장르의 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '장르별 영화 리스트 조회 성공',
    type: FindMovieListResponseDto,
  })
  @ApiQuery({
    name: 'genreId',
    required: true,
    description: '장르 ID (DB 내부 ID)',
    type: [Number],
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
  @CustomApiException(() => [
    ContentNotFoundException,
    InvalidGenreIdException,
    InvalidPageException,
  ])
  async getMoviesByGenreIds(
    @Query() query: GenrePaginationQueryDto,
  ): Promise<FindMovieListResponseDto> {
    const { genreId, page, limit } = query;
    return this.movieService.getMoviesByGenreIds(genreId, page, limit);
  }

  @Get(':movieId')
  @ApiOperation({
    summary: '영화 상세 정보 조회',
    description: '영화 ID를 통해 영화의 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '영화 상세 정보 조회 성공',
    type: FindMovieDetailResponseDto,
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
  ): Promise<FindMovieDetailResponseDto> {
    return this.movieService.findMovieById(movieId);
  }

  @Get(':movieId/recommends')
  @ApiOperation({
    summary: '추천 영화 리스트 조회',
    description: '영화 ID를 통해 추천 영화 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '추천 영화 리스트 조회 성공',
    type: FindMovieListResponseDto,
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
  @CustomApiException(() => [ContentNotFoundException, InvalidPageException])
  async getRecommendedMoviesById(
    @Param('movieId') movieId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<FindMovieListResponseDto> {
    const { page, limit } = query;
    return this.movieService.getRecommendedMoviesById(movieId, page, limit);
  }
}
