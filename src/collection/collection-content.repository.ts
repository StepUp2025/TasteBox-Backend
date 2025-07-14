import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionContent } from './entities/collection-content.entity';

@Injectable()
export class CollectionContentRepository {
  constructor(
    @InjectRepository(CollectionContent)
    private readonly collectionContentRepository: Repository<CollectionContent>,
  ) {}

  async findRecentContentsByUserId(
    userId: number,
  ): Promise<CollectionContent[]> {
    return this.collectionContentRepository
      .createQueryBuilder('collectionContent')
      .leftJoinAndSelect('collectionContent.collection', 'collection')
      .leftJoinAndSelect('collectionContent.content', 'content')
      .where('collection.userId = :userId', { userId })
      .orderBy('collectionContent.createdAt', 'DESC')
      .getMany();
  }
}
