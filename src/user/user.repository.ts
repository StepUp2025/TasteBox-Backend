import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Preference } from 'src/preference/entities/preference.entity';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/request/create-user-request.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-request.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
  ) {}

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ nickname });
  }

  async createUser(dto: CreateUserRequestDto) {
    const { email, password, nickname, contact, provider } = dto;

    const newUser = User.create(email, password, nickname, provider, contact);

    return await this.userRepository.save(newUser);
  }

  async hasPreference(userId: number): Promise<boolean> {
    const count = await this.preferenceRepository.count({
      where: { user: { id: userId } },
    });
    return count > 0;
  }

  async updateUserProfile(
    userId: number,
    dto: UpdateUserProfileRequestDto,
    imageUrl?: string | null,
  ) {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    user.updateProfile(dto.nickname, dto.contact, imageUrl);

    await this.userRepository.save(user);
  }

  async updateUserImage(userId: number, imageUrl: string): Promise<void> {
    await this.userRepository.update(userId, { image: imageUrl });
  }

  async save(user: User) {
    await this.userRepository.save(user);
  }
}
