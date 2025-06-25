// genre.controller.ts
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { GenreService } from './genre.service';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ContentType } from '../common/types/content-type.enum';

@ApiTags('Genres')
@ApiBearerAuth()
@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('movies')
  @ApiOkResponse({ type: GenreListResponseDto })
  async getMovieGenres() {
    return this.genreService.getGenresResponse(ContentType.MOVIE);
  }

  @Get('tvs')
  @ApiOkResponse({ type: GenreListResponseDto })
  async getTVGenres() {
    return this.genreService.getGenresResponse(ContentType.TV);
  }

  @Post('sync')
  @ApiOkResponse({
    description: 'TMDB의 영화 및 TV 장르 정보를 전체 동기화합니다.',
  })
  async syncGenres() {
    await this.genreService.syncAllGenresFromTMDB();
    return { message: '장르 전체 동기화 완료' };
  }
}
