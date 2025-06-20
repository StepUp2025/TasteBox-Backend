import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { ContentType } from '../type/enum/contentType';

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
