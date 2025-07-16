import { Injectable } from '@nestjs/common';
import { CollectionContentRepository } from 'src/collection/collection-content.repository';
import { LatestContentsResponseDto } from './dto/latest-content-response.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly collectionContentRepository: CollectionContentRepository,
  ) {}

  async getRecentContentsAddedByUser(
    userId: number,
    limit: number,
  ): Promise<LatestContentsResponseDto> {
    const collectionContents =
      await this.collectionContentRepository.findRecentContentsByUserId(
        userId,
        limit,
      );
    const contents = collectionContents.map((cc) => cc.content.toSummaryDto());
    return new LatestContentsResponseDto(contents);
  }
}
