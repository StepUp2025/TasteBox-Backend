import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from 'src/common/enums/content-type.enum';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { InvalidGenreIdException } from './../../common/exceptions/invalid-genre-id.exception';
import { InvalidContentTypeException } from './../../content/exception/invalid-content-type.exception';
import { UpdatePreferenceRequestDto } from './../dto/request/update-preference-request.dto';
import { PreferenceDetailDto } from './../dto/response/preference-detail.dto';
import { Preference } from './../entities/preference.entity';

@Injectable()
export class PreferenceRepository {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
    private readonly dataSource: DataSource,
  ) {}

  // ContentType 기준 취향 조회
  async getPreferencesByContentType(
    user: User,
    contentType: ContentType,
  ): Promise<PreferenceDetailDto> {
    const preferences = await this.preferenceRepository.find({
      where: {
        user: { id: user.id },
        genre: { type: contentType },
      },
      relations: ['genre'],
    });

    return PreferenceDetailDto.of(preferences, contentType);
  }

  // 취향 업데이트 (초기 생성 및 수정)
  async updateUserPreferences(
    user: User,
    updateDto: UpdatePreferenceRequestDto,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const key in updateDto) {
        if (Object.hasOwn(updateDto, key)) {
          const genreIdsDto = updateDto[key]; // genreIdsDto = { "genreIds": [25, 27] }
          const genreIds = genreIdsDto.genreIds; // genreIds = [25, 27]
          const contentTypeValue = key.toLowerCase();
          const foundContentType = Object.values(ContentType).find(
            (enumMember) =>
              typeof enumMember === 'string' && enumMember === contentTypeValue,
          );

          if (foundContentType) {
            const contentType: ContentType = foundContentType as ContentType;
            await this.updateUserPreferencesBySingleContentType(
              user,
              contentType,
              queryRunner.manager,
              genreIds,
            );
          } else {
            throw new InvalidContentTypeException();
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 단일 ContentType 기준 취향 업데이트
  private async updateUserPreferencesBySingleContentType(
    user: User,
    contentType: ContentType,
    transactionalEntityManager: EntityManager,
    genreIds: number[],
  ): Promise<void> {
    // 1. 기존 취향 삭제
    const preferencesToDelete = await transactionalEntityManager
      .createQueryBuilder(Preference, 'preference')
      .innerJoin('preference.genre', 'genre')
      .where('preference.userId = :userId', { userId: user.id })
      .andWhere('genre.type = :contentType', { contentType })
      .select('preference.id')
      .getMany();

    const preferenceIds = preferencesToDelete.map((p) => p.id);

    if (preferenceIds.length > 0) {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(Preference)
        .whereInIds(preferenceIds)
        .execute();
    }

    // 2. 취향 생성 및 저장
    if (genreIds.length > 0) {
      const genres = await transactionalEntityManager.findBy(Genre, {
        id: In(genreIds),
        type: contentType,
      });

      if (genres.length !== genreIds.length) {
        throw new InvalidGenreIdException();
      }

      const newPreferences = genres.map((genre) => {
        return Preference.create(user, genre);
      });
      await transactionalEntityManager.save(newPreferences);
    }
  }
}
