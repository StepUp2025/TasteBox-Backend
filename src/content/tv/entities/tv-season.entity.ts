import { BaseEntity } from 'src/common/entities/base.entity';
import { SourceType } from 'src/common/types/source-type.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Tv } from './tv-series.entity';

@Entity()
@Index(['tvSeries', 'seasonNumber'], { unique: true }) // 복합 유니크 인덱스
export class TvSeason extends BaseEntity {
  @Column({ type: 'enum', enum: SourceType })
  source: SourceType;

  @Column({ type: 'varchar', length: 255 })
  externalId: string;

  @ManyToOne(
    () => Tv,
    (series) => series.tvSeasons,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'tvSeriesId' })
  tvSeries: Tv;

  @RelationId((season: TvSeason) => season.tvSeries)
  tvSeriesId: number;

  @Column({ type: 'int' })
  seasonNumber: number;

  @Column({ type: 'int', nullable: true })
  episodeCount: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  posterPath: string | null;

  @Column({ type: 'date', nullable: true })
  airDate: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  overview: string | null;

  @Column({ type: 'float', nullable: true })
  voteAverage: number | null;
}
