import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from './decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as ms from 'ms';
import { setTokenCookie } from 'src/utils/cookie.util';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

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
  async signup(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description:
      '로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되어 반환됩니다.',
  })
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );

    const accessTokenMaxAge = ms(
      (process.env.JWT_EXPIRES_IN as ms.StringValue) ?? '1d',
    );
    const refreshTokenMaxAge = ms(
      (process.env.REFRESH_JWT_EXPIRES_IN as ms.StringValue) ?? '7d',
    );

    setTokenCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setTokenCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);

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

    const accessTokenMaxAge = ms(
      (process.env.JWT_EXPIRES_IN as ms.StringValue) ?? '1d',
    );
    const refreshTokenMaxAge = ms(
      (process.env.REFRESH_JWT_EXPIRES_IN as ms.StringValue) ?? '7d',
    );

    setTokenCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setTokenCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);

    return res.sendStatus(HttpStatus.OK);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );

    const accessTokenMaxAge = ms(
      (process.env.JWT_EXPIRES_IN as ms.StringValue) ?? '1d',
    );
    const refreshTokenMaxAge = ms(
      (process.env.REFRESH_JWT_EXPIRES_IN as ms.StringValue) ?? '7d',
    );

    setTokenCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setTokenCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);

    return res.redirect(`http://localhost:5000`);
  }
}
