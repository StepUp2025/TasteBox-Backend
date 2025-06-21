import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    unique: true,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  contact: string;

  @Column()
  image: string;
}
