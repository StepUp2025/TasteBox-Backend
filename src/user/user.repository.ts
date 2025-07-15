import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { User } from './user.entity';

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
    const { email, password, nickname, contact, provider } = dto;

    const newUser = User.create(email, password, nickname, provider, contact);

    return await this.repository.save(newUser);
  }

  async updateUserProfile(
    userId: number,
    dto: UpdateUserProfileRequestDto,
    imageKey?: string | null,
  ) {
    const updateData =
      imageKey !== undefined ? { ...dto, image: imageKey } : { ...dto };

    return await this.repository.update(userId, updateData);
  }

  async updateUserImage(userId: number, imageUrl: string): Promise<void> {
    await this.repository.update(userId, { image: imageUrl });
  }

  async save(user: User) {
    await this.repository.save(user);
  }
}
