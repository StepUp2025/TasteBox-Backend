import { Genre } from 'src/genre/entities/genre.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentGenre {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Content,
    (content) => content.contentGenres,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @ManyToOne(
    () => Genre,
    (genre) => genre.contentGenres,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
