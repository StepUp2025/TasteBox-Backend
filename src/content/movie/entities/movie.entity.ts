import { ContentSummaryDto } from 'src/content/dto/content-summary.dto';
import { Content } from 'src/content/entities/content.entity';
import { MovieStatus } from 'src/content/enum/movie-status.enum';
import { ChildEntity, Column } from 'typeorm';

@ChildEntity()
export class Movie extends Content {
  @Column({ type: 'text', nullable: true })
  overview: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  posterPath: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  backdropPath: string | null;

  @Column({ type: 'float', nullable: true })
  voteAverage: number | null;

  @Column({ type: 'int', nullable: true })
  voteCount: number | null;

  @Column({ type: 'float', nullable: true })
  popularity: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  englishTitle: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  originalTitle: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  originalLanguage: string | null;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date | null;

  @Column({ type: 'boolean', default: false })
  adult: boolean;

  @Column({ type: 'int', nullable: true })
  runtime: number | null;

  @Column({ type: 'varchar', nullable: true })
  status: MovieStatus | null;

  get displayTitle(): string {
    if (this.hasKoreanTitle) {
      return this.title;
    }
    return this.englishTitle || this.originalTitle || this.title;
  }

  toSummaryDto(): ContentSummaryDto {
    return new ContentSummaryDto({
      id: this.id,
      posterPath: this.posterPath ?? '',
      title: this.displayTitle,
      contentType: this.type,
    });
  }
}
