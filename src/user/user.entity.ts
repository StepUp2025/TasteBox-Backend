import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ unique: true })
  nickname: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password === null || this.password === '') {
      return;
    }

    this.password = await bcrypt.hash(this.password, 10);
  }

  static create(
    email: string,
    password: string | null,
    nickname: string,
    contact?: string,
    image?: string,
  ) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.contact = contact ?? null;
    user.image = image ?? null;
  }

  updateProfile(
    nickname?: string,
    contact?: string | null,
    image?: string | null,
  ) {
    if (nickname !== undefined) this.nickname = nickname;
    if (contact !== undefined) this.contact = contact;
    if (image !== undefined) this.image = image;
  }
}
