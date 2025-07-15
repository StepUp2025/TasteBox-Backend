import { ConfigService } from '@nestjs/config';
import { Content } from 'src/content/entities/content.entity';
import { SelectQueryBuilder } from 'typeorm';

export abstract class ContentBaseRepository<T extends Content> {
  protected constructor(protected readonly configService: ConfigService) {}

  protected abstract getRepository(): SelectQueryBuilder<T>;

  // 가중 평균 평점 계산 공식 반환
  protected getWeightedRatingFormula(
    globalAverageRating: number,
    minVotesRequired: number,
  ): string {
    return (
      `(content.voteCount / (content.voteCount + ${minVotesRequired})) * content.voteAverage + ` +
      `(${minVotesRequired} / (content.voteCount + ${globalAverageRating})) * ${globalAverageRating}`
    );
  }

  // 인기 있는 콘텐츠 목록 조회
  protected abstract findPopular(
    page: number,
    limit: number,
  ): Promise<[T[], number]>;

  // 가중 평점 기반 평점 높은 콘텐츠 목록 조회
  protected abstract findTopRated(
    page: number,
    limit: number,
  ): Promise<[T[], number]>;

  // 장르 ID 기반 콘텐츠 목록 조회
  async findByGenreIds(
    genreIds: number[],
    page: number,
    limit: number,
  ): Promise<[T[], number]> {
    const queryBuilder = this.getRepository()
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('genre.id IN (:...genreIds)', { genreIds })
      .distinctOn(['content.id']);

    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 추천 콘텐츠 목록 조회
  async findRecommendById(
    contentId: number,
    page: number,
    limit: number,
    getDetailMethod: (id: number) => Promise<T>,
  ): Promise<[T[], number]> {
    const contentWithGenres = await getDetailMethod(contentId);
    const genres = contentWithGenres.contentGenres;
    if (!genres || genres.length === 0) return [[], 0];

    const genreIds = genres.map((cg) => cg.genre.id);

    const queryBuilder = this.getRepository()
      .innerJoin('content.contentGenres', 'contentGenre')
      .innerJoin('contentGenre.genre', 'genre')
      .where('content.id != :contentId', { contentId })
      .andWhere('genre.id IN (:...genreIds)', { genreIds })
      .orderBy('content.popularity', 'DESC')
      .distinctOn(['content.id']);

    return this.applyPaginationAndGetManyAndCount(queryBuilder, page, limit);
  }

  // 페이징 적용 및 결과 반환을 위한 헬퍼 메서드
  protected async applyPaginationAndGetManyAndCount(
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number,
  ): Promise<[T[], number]> {
    const paginatedQuery = queryBuilder.skip((page - 1) * limit).take(limit);

    return await paginatedQuery.getManyAndCount();
  }
}
