import { CollectionContent } from 'src/collection/entities/collection-content.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
  @ManyToOne(
    () => User,
    (user) => user.collections,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @OneToMany(
    () => CollectionContent,
    (cc) => cc.collection,
  )
  collectionContents: CollectionContent[];

  @Column({ type: 'varchar' })
  thumbnail: string; // URL

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  static create(
    userId: number,
    title: string,
    thumbnailUrl: string,
    description?: string,
  ) {
    const collection = new Collection();
    collection.user = { id: userId } as User;
    collection.title = title;
    collection.thumbnail = thumbnailUrl;
    collection.description = description ?? null;
    return collection;
  }
}
