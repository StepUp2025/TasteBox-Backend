import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
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
    image?: string,
  ) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.provider = provider ?? AuthProvider.LOCAL;
    user.contact = contact ?? null;
    user.image = image ?? null;
    return user;
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

  updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
