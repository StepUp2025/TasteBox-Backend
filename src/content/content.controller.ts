import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { ContentService } from './content.service';
import { LatestContentsResponseDto } from './dto/latest-content-response.dto';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원의 전체 컬렉션에서 최근 추가된 컨텐츠 조회' })
  @ApiOkResponse({
    description: '최근 추가된 컨텐츠 목록 및 개수 반환',
    type: LatestContentsResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async findRecentContentsByUser(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.contentService.getRecentContentsAddedByUser(userId);
  }
}
