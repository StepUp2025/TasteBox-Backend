import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
}
