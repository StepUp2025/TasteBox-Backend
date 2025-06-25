import { Expose } from 'class-transformer';
import { ContentType } from 'src/common/types/content-type.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
