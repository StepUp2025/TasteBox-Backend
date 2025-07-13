import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/common/aws/s3.service';
import { FileDomain } from 'src/common/enums/s3.enum';
import { ForbiddenException } from 'src/common/exceptions/forbidden.exception';
import { Content } from 'src/content/entities/content.entity';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { UserRepository } from 'src/user/user.repository';
import { In, Repository } from 'typeorm';
import { CollectionRepository } from './collection.repository';
import { CreateCollectionRequestDto } from './dto/request/create-collection-request.dto';
import { UpdateCollectionRequestDto } from './dto/request/update-collection-request.dto';
import { CollectionDetailResponseDto } from './dto/response/collection-detail-response.dto';
import { CollectionListResponseDto } from './dto/response/collection-list-response.dto';
import { CollectionSummaryDto } from './dto/response/collection-summary.dto';
import { ContentSummaryDto } from './dto/response/content-summary.dto';
import { CollectionDeleteFailException } from './exception/collection-delete-fail.exception';
import { CollectionNotFoundException } from './exception/collection-not-found.exception';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly userRepository: UserRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  async createCollection(
    userId: number,
    dto: CreateCollectionRequestDto,
    thumbnail?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new UserNotFoundException();

    const thumbnailUrl = thumbnail
      ? await this.s3Service.uploadFile({
          file: {
            ...thumbnail,
            /*
              Multer 라이브러리가 latin1 인코딩을 사용하기 때문에 파일명이 한글인 경우 인코딩에 문제가 생깁니다.
              Buffer.from(originalname, 'latin1').toString('utf8')로 깨진 파일명을 원래의 UTF-8 파일명으로 복원해주는 과정을 거쳤습니다.
            **/
            originalname: Buffer.from(
              thumbnail.originalname,
              'latin1',
            ).toString('utf8'),
          },
          domain: FileDomain.COLLECTIONS,
          userId,
        })
      : this.getRandomDefaultThumbnailUrl();

    return this.collectionRepository.create(userId, dto, thumbnailUrl);
  }

  async getCollections(
    userId: number,
    isSelf: boolean,
  ): Promise<CollectionListResponseDto> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new UserNotFoundException();

    const collections = await this.collectionRepository.findAllByUserId(
      userId,
      {
        relations: ['collectionContents', 'collectionContents.content'],
        isPublic: isSelf ? undefined : true,
      },
    );

    const collectionSummaryDtos = collections.map((collection) => {
      const contentIds = collection.collectionContents.map(
        (cc) => cc.content.id,
      );
      return new CollectionSummaryDto({
        id: collection.id,
        title: collection.title,
        thumbnail: collection.thumbnail,
        description: collection.description,
        contents: contentIds,
      });
    });

    return new CollectionListResponseDto({
      collections: collectionSummaryDtos,
      count: collectionSummaryDtos.length,
    });
  }

  async getCollectionById(
    collectionId: number,
    userId: number,
  ): Promise<CollectionDetailResponseDto> {
    const collection = await this.collectionRepository.findOneByCollectionId(
      collectionId,
      {
        relations: ['user', 'collectionContents', 'collectionContents.content'],
      },
    );
    if (!collection) throw new CollectionNotFoundException();

    if (collection.user.id !== userId) {
      if (!collection.isPublic) {
        throw new ForbiddenException();
      }
    }
    const contentSummaryDtos: ContentSummaryDto[] =
      collection.collectionContents.map((cc) => cc.content.toSummaryDto());

    return new CollectionDetailResponseDto({
      id: collection.id,
      title: collection.title,
      thumbnail: collection.thumbnail,
      description: collection.description ? collection.description : '',
      contents: contentSummaryDtos,
    });
  }

  async updateCollection(
    collectionId: number,
    userId: number,
    dto: UpdateCollectionRequestDto,
    thumbnail?: Express.Multer.File,
  ): Promise<void> {
    const collection = await this.collectionRepository.findOneByCollectionId(
      collectionId,
      { relations: ['user'] },
    );

    if (!collection) throw new CollectionNotFoundException();
    if (collection.user.id !== userId) throw new ForbiddenException();

    const oldThumbnailUrl = collection.thumbnail;

    const newThumbnailUrl = thumbnail
      ? await this.s3Service.uploadFile({
          file: {
            ...thumbnail,
            /*
              Multer 라이브러리가 latin1 인코딩을 사용하기 때문에 파일명이 한글인 경우 인코딩에 문제가 생깁니다.
              Buffer.from(originalname, 'latin1').toString('utf8')로 깨진 파일명을 원래의 UTF-8 파일명으로 복원해주는 과정을 거쳤습니다.
            **/
            originalname: Buffer.from(
              thumbnail.originalname,
              'latin1',
            ).toString('utf8'),
          },
          domain: FileDomain.COLLECTIONS,
          userId,
        })
      : collection.thumbnail;

    const result = await this.collectionRepository.updateByCollectionId(
      collectionId,
      dto,
      newThumbnailUrl,
    );

    if (result.affected === 0) {
      throw new CollectionNotFoundException();
    }

    if (oldThumbnailUrl !== newThumbnailUrl) {
      await this.deleteThumbnailIfCustom(oldThumbnailUrl);
    }
  }

  async deleteCollection(collectionId: number, userId: number) {
    const collection = await this.collectionRepository.findOneByCollectionId(
      collectionId,
      { relations: ['user'] },
    );
    if (!collection) throw new CollectionNotFoundException();
    if (collection.user.id !== userId) throw new ForbiddenException();

    // 썸네일 삭제 (S3)
    const thumbnailUrl = collection.thumbnail;
    await this.deleteThumbnailIfCustom(thumbnailUrl);

    const deleted =
      await this.collectionRepository.deleteByCollectionId(collectionId);

    if (!deleted) {
      throw new CollectionDeleteFailException();
    }
  }

  async addContents(
    collectionId: number,
    userId: number,
    contentIds: number[],
  ): Promise<void> {
    // 컬렉션 및 회원 검증
    const collection = await this.collectionRepository.findOneByCollectionId(
      collectionId,
      { relations: ['user'] },
    );

    if (!collection) throw new CollectionNotFoundException();
    if (collection.user.id !== userId) throw new ForbiddenException();

    // 검증된/존재하는 컨텐츠만 추가
    const foundContents = await this.contentRepository.find({
      where: { id: In(contentIds) },
      select: ['id'],
    });
    const foundIds = foundContents.map((content) => content.id);
    const toAdd = contentIds.filter((id) => foundIds.includes(id));

    if (toAdd.length > 0) {
      await this.collectionRepository.addContentsToCollection(
        collectionId,
        toAdd,
      );
    }
  }

  async removeContents(
    collectionId: number,
    userId: number,
    contentIds: number[],
  ): Promise<void> {
    const collection = await this.collectionRepository.findOneByCollectionId(
      collectionId,
      { relations: ['user'] },
    );

    if (!collection) throw new CollectionNotFoundException();
    if (collection.user.id !== userId) throw new ForbiddenException();

    const foundContents = await this.contentRepository.find({
      where: { id: In(contentIds) },
      select: ['id'],
    });

    const foundIds = foundContents.map((content) => content.id);
    const toDelete = contentIds.filter((id) => foundIds.includes(id));

    await this.collectionRepository.removeContentsFromCollection(
      collectionId,
      toDelete,
    );
  }

  private getRandomDefaultThumbnailUrl(): string {
    const defaultUrls = this.configService
      .getOrThrow<string>('DEFAULT_THUMBNAIL_URLS')
      .split(',');

    const randomIndex = Math.floor(Math.random() * defaultUrls.length);
    return defaultUrls[randomIndex];
  }

  private async deleteThumbnailIfCustom(url: string) {
    // 1. 기본 썸네일 목록 불러오기
    const defaultUrls = this.configService
      .getOrThrow<string>('DEFAULT_THUMBNAIL_URLS')
      .split(',');

    // 2. 만약 기본 썸네일이 아니면 S3에서 삭제
    if (url && !defaultUrls.includes(url)) {
      const key = decodeURIComponent(
        new URL(url).pathname.split('/').slice(2).join('/'),
      );
      await this.s3Service.deleteFile(key);
      this.logger.log('썸네일 삭제 완료');
    }
  }
}
