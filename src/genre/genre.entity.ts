import { ContentType } from 'src/common/types/content-type.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalGenreId: string;

  @Column()
  contentType: ContentType;

  @Column()
  name: string;

  @Column()
  emoji: string;
}
