import { Content } from 'src/content/entities/content.entity';
import { TvSeriesStatus } from 'src/content/enum/tv-series-status.enum';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { TvSeason } from './tv-season.entity';

@ChildEntity('tv')
export class Tv extends Content {
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
  originalTitle: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  englishTitle: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  originalLanguage: string | null;

  @Column({ type: 'date', nullable: true })
  firstAirDate: Date | null;

  @Column({ type: 'date', nullable: true })
  lastAirDate: Date | null;

  @Column({ type: 'int', nullable: true })
  numberOfEpisodes: number | null;

  @Column({ type: 'int', nullable: true })
  numberOfSeasons: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  originalName: string | null;

  @OneToMany(
    () => TvSeason,
    (season) => season.tvSeries,
    { cascade: true },
  )
  tvSeasons: TvSeason[];

  @Column({ type: 'boolean', default: false })
  adult: boolean;

  @Column({ type: 'varchar', nullable: true })
  status: TvSeriesStatus | null;

  get displayTitle(): string {
    if (this.hasKoreanTitle) {
      return this.title;
    }
    return this.englishTitle || this.originalTitle || this.title;
  }
}
