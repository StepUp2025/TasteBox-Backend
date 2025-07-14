import * as bcrypt from 'bcrypt';
import { Collection } from 'src/collection/entities/collection.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Preference } from './../preference/entities/preference.entity';
import { AuthProvider } from './enums/auth-provider.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    nullable: false,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider; // 'local', 'google' 등

  @OneToMany(
    () => Collection,
    (collection) => collection.user,
  )
  collections: Collection[];

  @OneToMany(
    () => Preference,
    (preference) => preference.user,
  )
  preference: Preference;

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
    provider?: AuthProvider,
    contact?: string,
    imageUrl?: string,
  ) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.provider = provider ?? AuthProvider.LOCAL;
    user.contact = contact ?? '';
    user.image = imageUrl ?? '';
    return user;
  }

  updateProfile(
    nickname: string,
    contact?: string | null,
    imageUrl?: string | null,
  ) {
    this.nickname = nickname;
    this.contact = contact ?? '';
    if (imageUrl) {
      this.image = imageUrl;
    }
  }

  updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
