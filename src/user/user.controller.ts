import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { UserResponseDto } from './dto/response/user-response.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiCookieAuth('accessToken')
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiCookieAuth()
  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiOkResponse({
    description: '회원 정보 조회 성공',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  async getUserInfo(@Req() req: RequestWithUser) {
    return await this.userService.findUserById(req.user.id);
  }

  @Patch('profile')
  @ApiCookieAuth()
  @ApiOperation({ summary: '회원 프로필 수정' })
  @ApiBody({ type: UpdateUserProfileRequestDto })
  @ApiOkResponse({
    description: '회원 프로필 수정 성공',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  async updateUserProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserProfileRequestDto,
  ) {
    await this.userService.updateUserProfile(req.user.id, dto);
  }
}
