import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserRequestDto } from 'src/user/dto/request/create-user-request.dto';
import { UserService } from 'src/user/user.service';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { Response } from 'express';
import * as ms from 'ms';
import { setTokenCookie } from 'src/utils/cookie.util';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { UpdatePasswordRequestDto } from './dto/request/update-password-request.dto';
import { LocalUserOnlyGuard } from './guards/local-auth/local-user-only.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({
    description: '회원가입 성공',
  })
  async signup(@Body() dto: CreateUserRequestDto) {
    await this.userService.createUser(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    description:
      '로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되어 반환됩니다.',
  })
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    this.setCookies(res, accessToken, refreshToken);
    return res.sendStatus(HttpStatus.OK);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({
    description: '로그아웃 성공 시 쿠키가 삭제됩니다',
  })
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.sendStatus(HttpStatus.OK);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiOkResponse({
    description:
      '토큰 갱신 성공 시 accessToken과 refreshToken이 쿠키에 저장되어 반환됩니다.',
  })
  async refreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user.id,
    );
    this.setCookies(res, accessToken, refreshToken);
    return res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(LocalUserOnlyGuard)
  @Put('password')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '로그인한 사용자의 비밀번호를 변경합니다.',
  })
  @ApiOkResponse({
    description: '비밀번호가 성공적으로 변경되었습니다.',
  })
  @ApiBody({ type: UpdatePasswordRequestDto })
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() dto: UpdatePasswordRequestDto,
  ) {
    await this.authService.updatePassword(req.user.id, dto);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({
    summary: 'Google 로그인 시작',
    description: 'Google OAuth 로그인을 시작합니다.',
  })
  @ApiOkResponse({
    description: 'Google 로그인 페이지로 리다이렉트됩니다.',
  })
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiOperation({
    summary: 'Google 로그인 콜백',
    description: 'Google OAuth 로그인 후 콜백을 처리합니다.',
  })
  @ApiOkResponse({
    description:
      'Google 로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되고, 프론트엔드로 리다이렉트됩니다.',
  })
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    this.setCookies(res, accessToken, refreshToken);
    return res.redirect(`http://localhost:5000`);
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const accessTokenMaxAge = ms(
      (process.env.JWT_EXPIRES_IN as ms.StringValue) ?? '1d',
    );

    const refreshTokenMaxAge = ms(
      (process.env.REFRESH_JWT_EXPIRES_IN as ms.StringValue) ?? '7d',
    );

    setTokenCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setTokenCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);
  }
}
