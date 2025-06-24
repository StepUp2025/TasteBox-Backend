import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';

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
    const { email, password, nickname, contact, image, provider } = dto;

    const newUser = User.create(
      email,
      password,
      nickname,
      provider,
      contact,
      image,
    );

    return await this.repository.save(newUser);
  }

  async updateUserProfile(userId: number, dto: UpdateUserProfileRequestDto) {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFoundException('');
    }

    user.updateProfile(dto.nickname, dto.contact, dto.image);

    await this.repository.save(user);
  }

  async save(user: User) {
    await this.repository.save(user);
  }
}
