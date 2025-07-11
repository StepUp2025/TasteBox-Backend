import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { GenreModule } from './../genre/genre.module';
import { Preference } from './entities/preference.entity';
import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Preference, User, Genre]),
    UserModule,
    GenreModule,
  ],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
