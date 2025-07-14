import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { ContentType } from 'src/common/enums/content-type.enum';
import { InvalidGenreIdException } from 'src/common/exceptions/invalid-genre-id.exception';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { JwtAuthGuard } from './../auth/guards/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from './../auth/types/request-with-user.interface';
import { InvalidContentTypeException } from './../content/exception/invalid-content-type.exception';
import { UpdatePreferenceRequestDto } from './dto/request/update-preference-request.dto';
import { GetPreferenceResponseDto } from './dto/response/get-preferences-response.dto';
import { PreferenceDetailDto } from './dto/response/preference-detail.dto';
import { PreferenceService } from './preference.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Preferences')
@Controller('users/preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Put('')
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
  @CustomApiException(() => [
    UserNotFoundException,
    InvalidContentTypeException,
    InvalidGenreIdException,
  ])
  async updateUserPreferences(
    @Req() req: RequestWithUser,
    @Body() body: UpdatePreferenceRequestDto,
  ) {
    return this.preferenceService.updateUserPreferences(req.user.id, body);
  }

  @Get('')
  @ApiOperation({
    summary: '회원 선호 장르 전체 조회',
    description: '회원이 선호하는 영화/TV 시리즈 전체 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    example: {
      [ContentType.MOVIE]: {
        // 'movie' 키
        genres: [
          { id: 1, name: '액션', emoji: '💥' },
          { id: 2, name: '코미디', emoji: '😂' },
        ],
        count: 2,
      } as PreferenceDetailDto,
      [ContentType.TVSERIES]: {
        genres: [
          { id: 10, name: '드라마', emoji: '😭' },
          { id: 11, name: '판타지', emoji: '🧚‍♀️' },
        ],
        count: 2,
      } as PreferenceDetailDto,
    } as GetPreferenceResponseDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  async getUserPreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getUserPreferences(req.user.id);
  }

  @Get('movies')
  @ApiOperation({
    summary: '회원 영화 취향 조회',
    description: '회원이 선호하는 영화 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 영화 취향 조회 성공',
    type: PreferenceDetailDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  async getMoviePreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getPreferencesByContentType(
      req.user.id,
      ContentType.MOVIE,
    );
  }

  @Get('tvs')
  @ApiOperation({
    summary: '회원 TV 시리즈 취향 조회',
    description: '회원이 선호하는 TV 시리즈 장르 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 TV 시리즈 취향 조회 성공',
    type: PreferenceDetailDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  async getTvPreferences(@Req() req: RequestWithUser) {
    return this.preferenceService.getPreferencesByContentType(
      req.user.id,
      ContentType.TVSERIES,
    );
  }
}
