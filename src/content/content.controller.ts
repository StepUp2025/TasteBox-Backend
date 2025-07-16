import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { ContentService } from './content.service';
import { LatestContentsResponseDto } from './dto/latest-content-response.dto';

@ApiTags('Content')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원의 전체 컬렉션에서 최근 추가된 컨텐츠 조회' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 5,
    description: '최대 결과 개수 (기본 10)',
  })
  @ApiOkResponse({
    description: '최근 추가된 컨텐츠 목록 및 개수 반환',
    type: LatestContentsResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('latest')
  async findRecentContentsByUser(
    @Req() req: RequestWithUser,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.id;
    return await this.contentService.getRecentContentsAddedByUser(
      userId,
      limit,
    );
  }
}
