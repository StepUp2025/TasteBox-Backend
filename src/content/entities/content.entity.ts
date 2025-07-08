import { BaseEntity } from 'src/common/entities/base.entity';
import { ContentType } from 'src/common/types/content-type.enum';
import { SourceType } from 'src/common/types/source-type.enum';
import { Column, Entity, OneToMany, TableInheritance } from 'typeorm';
import { ContentGenre } from './content-genre.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'dtype' } })
export abstract class Content extends BaseEntity {
  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ type: 'enum', enum: SourceType })
  source: SourceType;

  @Column({ type: 'varchar', length: 255 })
  externalId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'enum', enum: ContentType, name: 'dtype' })
  dtype: ContentType;

  @Column({ type: 'boolean', default: false })
  hasKoreanTitle: boolean;

  abstract get displayTitle(): string;

  @OneToMany(
    () => ContentGenre,
    (cg) => cg.content,
    { cascade: true },
  )
  contentGenres: ContentGenre[];
}
