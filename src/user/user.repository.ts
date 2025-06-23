import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user-request.dto';

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

  async createUser(dto: CreateUserRequestDto) {
    const { email, password, nickname, contact, image } = dto;

    const newUser = this.repository.create({
      email,
      password,
      nickname,
      contact,
      image,
    });

    return await this.repository.save(newUser);
  }

  async updateUser(userId: number, dto: UpdateUserRequestDto) {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('');
    }

    const { nickname, image } = dto;

    if (nickname) {
      user.nickname = nickname;
    }

    if (image) {
      user.image = image;
    }

    await this.repository.save(user);
  }
}
