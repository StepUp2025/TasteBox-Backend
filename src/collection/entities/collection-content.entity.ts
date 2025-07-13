import { Collection } from 'src/collection/entities/collection.entity';

import { Content } from 'src/content/entities/content.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CollectionContent {
  @PrimaryGeneratedColumn()
  id: number;

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
