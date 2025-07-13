import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { updateUserProfileValidationErrorSchema } from 'src/common/swagger/update-user-profile-validation-error-schema';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { RequestWithUser } from '../auth/types/request-with-user.interface';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { DuplicateNicknameException } from './exceptions/duplicate-nickname.exception';
import { UserService } from './user.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiOkResponse({
    description: '회원 정보 조회 성공',
    type: UserResponseDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  async getUserInfo(@Req() req: RequestWithUser) {
    return await this.userService.findUserById(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '회원 프로필 수정',
    description: '회원 프로필을 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '회원 프로필 수정 시 필요 정보',
    type: UpdateUserProfileRequestDto,
  })
  @ApiOkResponse({
    description: '회원 프로필 수정 성공',
  })
  @ApiBadRequestResponse({ schema: updateUserProfileValidationErrorSchema })
  @CustomApiException(() => [DuplicateNicknameException])
  @Patch('profile')
  @UseInterceptors(FileInterceptor('image'))
  async updateUserProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserProfileRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    await this.userService.updateUserProfile(req.user.id, dto, image);
  }
}
