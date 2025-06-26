import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { UserResponseDto } from './dto/response/user-response.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { DuplicateNicknameException } from './exceptions/duplicate-nickname.exception';

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
  @CustomApiException(() => [UserNotFoundException])
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
  @CustomApiException(() => [DuplicateNicknameException])
  async updateUserProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserProfileRequestDto,
  ) {
    await this.userService.updateUserProfile(req.user.id, dto);
  }
}
