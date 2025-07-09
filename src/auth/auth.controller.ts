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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import * as ms from 'ms';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { loginValidationErrorSchema } from 'src/common/swagger/login-validation-error-schema';
import { passwordValidationErrorSchema } from 'src/common/swagger/password-validation-error-schema';
import { signupValidationErrorSchema } from 'src/common/swagger/signup-validation-error-schema';
import { setTokenCookie } from 'src/common/utils/cookie.util';
import { CreateUserRequestDto } from 'src/user/dto/request/create-user-request.dto';
import { UniqueNicknameGenerationException } from 'src/user/exceptions/unique-nickname-generation.exception';
import { UserService } from 'src/user/user.service';
import { DuplicateNicknameException } from '../user/exceptions/duplicate-nickname.exception';
import { UserNotFoundException } from '../user/exceptions/user-not-found.exception';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { UpdatePasswordRequestDto } from './dto/request/update-password-request.dto';
import { AlreadyRegisteredAccountException } from './exceptions/already-registered-account.exception';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import { InvalidCurrentPasswordException } from './exceptions/invalid-current-password.exception';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';
import { OAuthAccountLoginException } from './exceptions/oauth-account-login.exception';
import { OAuthAccountPasswordChangeException } from './exceptions/oauth-account-password-change.exception';
import { PasswordMismatchException } from './exceptions/password-mismatch.exception';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth/kakao-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LocalUserOnlyGuard } from './guards/local-auth/local-user-only.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Local 회원가입' })
  @ApiCreatedResponse({
    description: '회원가입 성공',
  })
  @ApiBadRequestResponse({ schema: signupValidationErrorSchema })
  @CustomApiException(() => [
    DuplicateNicknameException,
    AlreadyRegisteredAccountException,
  ])
  async signup(@Body() dto: CreateUserRequestDto) {
    await this.userService.createLocalUser(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Local 회원 로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    description:
      '로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되어 반환됩니다.',
  })
  @ApiBadRequestResponse({ schema: loginValidationErrorSchema })
  @CustomApiException(() => [
    InvalidCredentialsException,
    OAuthAccountLoginException,
    UserNotFoundException,
  ])
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    this.setRefreshTokenToCookie(res, refreshToken);
    return res.status(HttpStatus.OK).json({ accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({
    description: '로그아웃 성공 시 쿠키가 삭제됩니다',
  })
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    return res.sendStatus(HttpStatus.OK);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiOkResponse({
    description:
      '토큰 갱신 성공 시 accessToken과 refreshToken이 쿠키에 저장되어 반환됩니다.',
  })
  @CustomApiException(() => [InvalidRefreshTokenException])
  async refreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user.id,
    );
    this.setRefreshTokenToCookie(res, refreshToken);
    return res.status(HttpStatus.OK).json({ accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(LocalUserOnlyGuard)
  @Put('password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '로그인한 사용자의 비밀번호를 변경합니다. (Local 회원만 가능)',
  })
  @ApiBody({ type: UpdatePasswordRequestDto })
  @ApiOkResponse({
    description: '비밀번호가 성공적으로 변경되었습니다.',
  })
  @ApiBadRequestResponse({ schema: passwordValidationErrorSchema })
  @CustomApiException(() => [
    UserNotFoundException,
    OAuthAccountPasswordChangeException,
    InvalidCurrentPasswordException,
    PasswordMismatchException,
  ])
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() dto: UpdatePasswordRequestDto,
  ) {
    await this.authService.updatePassword(req.user.id, dto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Google 로그인 시작',
    description:
      'Google OAuth 로그인을 시작합니다. 최초 로그인 시, 회원가입됩니다.',
  })
  @ApiFoundResponse({
    description: 'Google 로그인 페이지로 리다이렉트됩니다.',
  })
  @CustomApiException(() => [
    AlreadyRegisteredAccountException,
    UniqueNicknameGenerationException,
  ])
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: 'Google 로그인 콜백',
    description: 'Google OAuth 로그인 후 콜백을 처리합니다.',
  })
  @ApiFoundResponse({
    description:
      'Google 로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되고, 프론트엔드로 리다이렉트됩니다.',
  })
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    this.setRefreshTokenToCookie(res, refreshToken);

    res.setHeader('Content-Type', 'text/html');
    this.sendAccessTokenToPopup(res, accessToken);
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/login')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: '카카오 로그인 시작',
    description:
      '카카오 OAuth 로그인을 시작합니다. 최초 로그인 시, 회원가입됩니다.',
  })
  @ApiFoundResponse({
    description: '카카오 로그인 페이지로 리다이렉트됩니다.',
  })
  @CustomApiException(() => [
    AlreadyRegisteredAccountException,
    UniqueNicknameGenerationException,
  ])
  kakaoLogin() {}

  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 OAuth 로그인 후 콜백을 처리합니다.',
  })
  @ApiFoundResponse({
    description:
      '카카오 로그인 성공 시 accessToken과 refreshToken이 쿠키에 저장되고, 프론트엔드로 리다이렉트됩니다.',
  })
  async kakaoCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    this.setRefreshTokenToCookie(res, refreshToken);

    res.setHeader('Content-Type', 'text/html');
    this.sendAccessTokenToPopup(res, accessToken);
    return;
  }

  private sendAccessTokenToPopup(res: Response, accessToken: string) {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
    <script>
      window.opener.postMessage(
        ${JSON.stringify({ accessToken })},
        "${process.env.FRONTEND_ORIGIN}"
      );
      window.close();
    </script>
  `);
  }

  private setRefreshTokenToCookie(res: Response, refreshToken: string) {
    const refreshTokenMaxAge = ms(
      (process.env.REFRESH_JWT_EXPIRES_IN as ms.StringValue) ?? '7d',
    );

    setTokenCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);
  }
}
