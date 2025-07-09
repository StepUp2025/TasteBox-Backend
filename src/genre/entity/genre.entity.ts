import { BaseEntity } from 'src/common/entities/base.entity';
import { ContentType } from 'src/common/enums/content-type.enum';
import { SourceType } from 'src/common/enums/source-type.enum';
import { ContentGenre } from 'src/content/entities/content-genre.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
@Index(['externalId', 'source', 'type'], { unique: true })
export class Genre extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  externalId: string;

  @Column({ type: 'enum', enum: SourceType })
  source: SourceType;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @OneToMany(
    () => ContentGenre,
    (cg) => cg.genre,
  )
  contentGenres: ContentGenre[];
}
