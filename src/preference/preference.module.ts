import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { GenreModule } from './../genre/genre.module';
import { Preference } from './entities/preference.entity';
import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';
import { PreferenceRepository } from './repository/preference.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Preference, User, Genre]),
    UserModule,
    GenreModule,
  ],
  controllers: [PreferenceController],
  providers: [PreferenceRepository, UserRepository, PreferenceService],
})
export class PreferenceModule {}
