import { Expose } from 'class-transformer';
import type { ContentType } from 'src/common/types/content-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  emoji: string;

  @Column()
  externalGenreId: string;

  @Column()
  contentType: ContentType;
}
