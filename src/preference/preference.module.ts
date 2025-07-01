import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/genre/entity/genre.entity';
import { User } from 'src/user/user.entity';
import { PreferenceController } from './preference.controller';
import { Preference } from './preference.entity';
import { PreferenceService } from './preference.service';

@Module({
  imports: [TypeOrmModule.forFeature([Preference, User, Genre])],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
