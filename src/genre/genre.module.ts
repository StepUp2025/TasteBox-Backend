import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { Genre } from './entity/genre.entity';
import { GenreRepository } from './genre.repository';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), HttpModule, ConfigModule],
  controllers: [GenreController],
  providers: [GenreRepository, GenreService],
})
export class GenreModule {}
