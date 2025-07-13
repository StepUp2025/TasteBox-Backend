import { Collection } from 'src/collection/entities/collection.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

import { Content } from 'src/content/entities/content.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CollectionContent extends BaseEntity {
  @ManyToOne(
    () => Collection,
    (collection) => collection.collectionContents,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: Content;
}
