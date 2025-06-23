import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequestDto } from './dto/request/update-user-request.dto';
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

  @Get()
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

  @Patch()
  @ApiCookieAuth()
  @ApiOperation({ summary: '회원 정보 수정' })
  @ApiBody({ type: UpdateUserRequestDto })
  @ApiOkResponse({
    description: '회원 정보 수정 성공',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청' })
  async updateUserInfo(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserRequestDto,
  ) {
    await this.userService.updateUser(req.user.id, dto);
  }
}
