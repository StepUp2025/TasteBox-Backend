import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Genre } from '../genre/entity/genre.entity';

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
