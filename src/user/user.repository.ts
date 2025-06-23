import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    return await this.repository.findOneBy({ nickname });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, nickname, contact, image } = createUserDto;

    const newUser = this.repository.create({
      email,
      password,
      nickname,
      contact,
      image,
    });

    return await this.repository.save(newUser);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('');
    }

    const { nickname, image } = updateUserDto;

    if (nickname) {
      user.nickname = nickname;
    }

    if (image) {
      user.image = image;
    }

    await this.repository.save(user);
  }
}
