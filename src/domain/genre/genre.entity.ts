import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ContentType } from '../type/enum/contentType';

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
