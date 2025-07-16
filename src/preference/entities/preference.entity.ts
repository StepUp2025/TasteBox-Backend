import { BaseEntity } from 'src/common/entities/base.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Preference extends BaseEntity {
  @ManyToOne(
    () => User,
    (user) => user.preference,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Genre, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;

  static create(user: User, genre: Genre): Preference {
    const preference = new Preference();
    preference.user = user;
    preference.genre = genre;
    return preference;
  }
}
