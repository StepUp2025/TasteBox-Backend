import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { GenreNotFoundException } from 'src/genre/exceptions/genre-not-found.exception';
import { JwtAuthGuard } from './../auth/guards/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from './../auth/types/request-with-user.interface';
import { UpdatePreferenceRequestDto } from './dto/request/update-preference-request.dto';
import { GetPreferenceResponseDto } from './dto/response/get-preferences-response.dto';
import { PreferenceService } from './preference.service';

@ApiTags('Preferences')
@Controller('users')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  @ApiOperation({
    summary: '회원 선호 장르 저장',
    description: '회원이 선호하는 영화/TV 시리즈 장르 목록을 저장합니다.',
  })
  @ApiOkResponse({
    description: '회원이 선호하는 장르 저장 성공',
  })
  @ApiBody({
    type: UpdatePreferenceRequestDto,
  })
  @CustomApiException(() => [GenreNotFoundException])
  async updateUserPreferences(
    @Req() req: RequestWithUser,
    @Body() body: UpdatePreferenceRequestDto,
  ) {
    return this.preferenceService.updateUserPreferences(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  @ApiOperation({
    summary: '회원 선호 장르 전체 조회',
    description: '회원이 선호하는 영화/TV 시리즈 전체 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 선호 장르 전체 조회 성공',
    type: GetPreferenceResponseDto,
  })
  async getUserPreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getUserPreferences(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences/movies')
  @ApiOperation({
    summary: '회원 영화 취향 조회',
    description: '회원이 선호하는 영화 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 영화 취향 조회 성공',
    schema: {
      example: {
        genres: [
          { id: 1, name: '액션', emoji: '🔥' },
          { id: 2, name: '모험', emoji: '🗺️' },
        ],
        count: 2,
      },
    },
  })
  async getMoviePreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getMoviePreferences(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences/tvs')
  @ApiOperation({
    summary: '회원 TV 시리즈 취향 조회',
    description: '회원이 선호하는 TV 시리즈 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 TV 시리즈 취향 조회 성공',
    schema: {
      example: {
        genres: [
          { id: 21, name: '애니메이션', emoji: '🎨' },
          { id: 24, name: '드라마', emoji: '🎭' },
        ],
        count: 2,
      },
    },
  })
  async getTvPreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getTvPreferences(req.user.id);
  }
}
