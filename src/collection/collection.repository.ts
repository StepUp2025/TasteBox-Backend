import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm';
import { CreateCollectionRequestDto } from './dto/request/create-collection-request.dto';
import { UpdateCollectionRequestDto } from './dto/request/update-collection-request.dto';
import { Collection } from './entities/collection.entity';
import { CollectionContent } from './entities/collection-content.entity';

@Injectable()
export class CollectionRepository {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionContent)
    private readonly collectionContentRepository: Repository<CollectionContent>,
  ) {}

  async create(
    userId: number,
    dto: CreateCollectionRequestDto,
    thumbnailUrl: string,
  ): Promise<Collection | null> {
    const { title, description } = dto;

    const newCollection = Collection.create(
      userId,
      title,
      thumbnailUrl,
      description,
    );
    return this.collectionRepository.save(newCollection);
  }

  async findOneByCollectionId(
    collectionId: number,
    options?: { relations?: string[] },
  ): Promise<Collection | null> {
    return await this.collectionRepository.findOne({
      where: { id: collectionId },
      relations: options?.relations,
    });
  }

  async findOneWithOrderedContents(
    collectionId: number,
  ): Promise<Collection | null> {
    return await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.user', 'user')
      .leftJoinAndSelect('collection.collectionContents', 'collectionContent')
      .leftJoinAndSelect('collectionContent.content', 'content')
      .where('collection.id = :collectionId', { collectionId })
      .orderBy('collectionContent.createdAt', 'DESC')
      .getOne();
  }

  async findAllByUserId(
    userId: number,
    options?: { isPublic?: boolean; relations?: string[] },
  ): Promise<Collection[]> {
    const where: FindOptionsWhere<Collection> = { user: { id: userId } };
    if (options?.isPublic !== undefined) {
      where.isPublic = options.isPublic;
    }
    return this.collectionRepository.find({
      where,
      relations: options?.relations,
    });
  }

  async updateByCollectionId(
    collectionId: number,
    dto: UpdateCollectionRequestDto,
    thumbnailUrl?: string,
  ): Promise<UpdateResult> {
    const updateData = thumbnailUrl
      ? { ...dto, thumbnail: thumbnailUrl }
      : { ...dto };

    return await this.collectionRepository.update(collectionId, updateData);
  }

  async deleteByCollectionId(collectionId: number): Promise<boolean> {
    const result = await this.collectionRepository.delete({ id: collectionId });
    return !!result.affected;
  }

  async addContentsToCollection(
    collectionId: number,
    contentIds: number[],
  ): Promise<void> {
    if (!contentIds.length) return;

    const entities = contentIds.map((contentId) =>
      this.collectionContentRepository.create({
        collection: { id: collectionId },
        content: { id: contentId },
      }),
    );

    await this.collectionContentRepository.save(entities);
  }

  async removeContentsFromCollection(
    collectionId: number,
    contentIds: number[],
  ): Promise<void> {
    if (!contentIds.length) return;

    await this.collectionContentRepository.delete({
      collection: { id: collectionId },
      content: In(contentIds),
    });
  }
}
