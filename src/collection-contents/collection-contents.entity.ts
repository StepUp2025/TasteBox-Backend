import { Collection } from 'src/collection/collection.entity';

import type { ContentType } from 'src/common/enums/content-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CollectionContents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Collection)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;

  @Column()
  contentType: ContentType;

  @Column()
  contentId: number;
}
