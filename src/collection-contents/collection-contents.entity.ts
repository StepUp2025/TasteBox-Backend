import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ContentType } from 'src/common/types/content-type.enum';
import { Collection } from 'src/collection/collection.entity';

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
