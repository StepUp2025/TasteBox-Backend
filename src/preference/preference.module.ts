import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/genre/entity/genre.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { GenreModule } from './../genre/genre.module';
import { PreferenceController } from './preference.controller';
import { Preference } from './preference.entity';
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
