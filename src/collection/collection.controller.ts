import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { S3DeleteFailException } from 'src/common/aws/exceptions/s3-delete-fail.exception';
import { S3UploadFailException } from 'src/common/aws/exceptions/s3-upload-fail.exception';
import { CustomApiException } from 'src/common/decorators/custom-api-exception.decorator';
import { ForbiddenException } from 'src/common/exceptions/forbidden.exception';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { CollectionService } from './collection.service';
import { ContentsQueryDto } from './dto/request/contents-query.dto';
import { CreateCollectionRequestDto } from './dto/request/create-collection-request.dto';
import { UpdateCollectionRequestDto } from './dto/request/update-collection-request.dto';
import { CollectionDetailResponseDto } from './dto/response/collection-detail-response.dto';
import { CollectionListResponseDto } from './dto/response/collection-list-response.dto';
import { CollectionDeleteFailException } from './exception/collection-delete-fail.exception';
import { CollectionNotFoundException } from './exception/collection-not-found.exception';

@ApiTags('Collection')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: '컬렉션 생성',
    description: '새로운 컬렉션을 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '생성할 컬렉션 정보 및 썸네일 파일',
    type: CreateCollectionRequestDto,
  })
  @ApiCreatedResponse({ description: '컬렉션 생성 성공' })
  @CustomApiException(() => [UserNotFoundException, S3UploadFailException])
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCollection(
    @Req() req: RequestWithUser,
    @Body() dto: CreateCollectionRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    thumbnail?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    await this.collectionService.createCollection(userId, dto, thumbnail);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 컬렉션 목록 조회',
    description: '로그인한 회원의 컬렉션 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '컬렉션 목록 조회 성공',
    type: CollectionListResponseDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyCollections(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return await this.collectionService.getCollections(userId, true);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '특정 회원의 컬렉션 목록 조회',
    description: '특정 회원의 "공개" 컬렉션 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '회원 고유 ID',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    description: '컬렉션 목록 조회 성공',
    type: CollectionListResponseDto,
  })
  @CustomApiException(() => [UserNotFoundException])
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserCollections(
    @Req() req: RequestWithUser,
    @Param('id') userId: number,
  ) {
    const isSelf = req.user.id === userId;
    return await this.collectionService.getCollections(userId, isSelf);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '단일 컬렉션 조회',
    description: 'ID로 컬렉션을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컬렉션 고유 ID',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    description: '컬렉션 조회 성공',
    type: CollectionDetailResponseDto,
  })
  @CustomApiException(() => [CollectionNotFoundException])
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCollection(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: number,
  ) {
    const userId = req.user.id;
    return await this.collectionService.getCollectionById(collectionId, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '컬렉션 정보 수정',
    description: '컬렉션의 제목, 설명, 썸네일을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컬렉션 고유 ID',
    type: Number,
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '수정할 컬렉션 정보 및 썸네일 파일',
    type: UpdateCollectionRequestDto,
  })
  @ApiOkResponse({ description: '수정 성공' })
  @CustomApiException(() => [CollectionNotFoundException, ForbiddenException])
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateCollection(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: number,
    @Body() dto: UpdateCollectionRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    thumbnail?: Express.Multer.File,
  ) {
    const userId = req.user.id;
    await this.collectionService.updateCollection(
      collectionId,
      userId,
      dto,
      thumbnail,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '컬렉션 삭제',
    description: '특정 컬렉션을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '컬렉션 고유 ID', type: Number })
  @ApiOkResponse({ description: '컬렉션 삭제 성공' })
  @CustomApiException(() => [
    ForbiddenException,
    CollectionNotFoundException,
    S3DeleteFailException,
    CollectionDeleteFailException,
  ])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCollection(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: number,
  ) {
    const userId = req.user.id;
    await this.collectionService.deleteCollection(collectionId, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '컬렉션에 컨텐츠 추가',
    description:
      '컬렉션에 컨텐츠를 추가합니다. 존재하지 않는 컨텐츠는 무시됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컬렉션 고유 ID',
    type: Number,
    required: true,
  })
  @ApiOkResponse({ description: '컨텐츠 추가 성공' })
  @CustomApiException(() => [CollectionNotFoundException, ForbiddenException])
  @UseGuards(JwtAuthGuard)
  @Post(':id/contents')
  @HttpCode(HttpStatus.OK)
  async addContentsToCollection(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: number,
    @Query()
    query: ContentsQueryDto,
  ) {
    const userId = req.user.id;
    const { contentId: contentIds } = query;
    console.log(contentIds);
    await this.collectionService.addContents(collectionId, userId, contentIds);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '컬렉션에서 컨텐츠 삭제',
    description:
      '컬렉션에서 컨텐츠를 삭제합니다. 존재하지 않는 컨텐츠는 무시됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컬렉션 고유 ID',
    type: Number,
    required: true,
  })
  @ApiOkResponse({ description: '컨텐츠 삭제 성공' })
  @CustomApiException(() => [CollectionNotFoundException, ForbiddenException])
  @UseGuards(JwtAuthGuard)
  @Delete(':id/contents')
  async removeContentsFromCollection(
    @Req() req: RequestWithUser,
    @Param('id') collectionId: number,
    @Query() query: ContentsQueryDto,
  ) {
    const userId = req.user.id;
    const { contentId: contentIds } = query;
    await this.collectionService.removeContents(
      collectionId,
      userId,
      contentIds,
    );
  }
}
