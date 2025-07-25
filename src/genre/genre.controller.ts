import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { ContentType } from 'src/common/enums/content-type.enum';
import { ContentNotFoundException } from 'src/common/exceptions/content-not-found.exception';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { GenreService } from './genre.service';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('movies')
  @ApiOperation({
    summary: '영화 장르 조회',
    description: '영화 장르를 조회합니다.',
  })
  @ApiOkResponse({
    description: '영화 장르 조회 성공',
    type: GenreListResponseDto,
  })
  @CustomApiException(() => [ExternalApiException, ContentNotFoundException])
  async getMovieGenres(): Promise<GenreListResponseDto> {
    return this.genreService.getGenresByType(ContentType.MOVIE);
  }

  @Get('tvs')
  @ApiOperation({
    summary: 'TV 시리즈 장르 조회',
    description: 'TV 시리즈 장르를 조회합니다.',
  })
  @ApiOkResponse({
    description: 'TV 시리즈 장르 조회 성공',
    type: GenreListResponseDto,
  })
  @CustomApiException(() => [ExternalApiException, ContentNotFoundException])
  async getTVGenres(): Promise<GenreListResponseDto> {
    return this.genreService.getGenresByType(ContentType.TVSERIES);
  }
}
