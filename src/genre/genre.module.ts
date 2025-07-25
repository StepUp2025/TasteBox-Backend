import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Genre } from './entities/genre.entity';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreRepository } from './repository/genre.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Genre]), HttpModule, ConfigModule],
  exports: [GenreService],
  controllers: [GenreController],
  providers: [GenreRepository, GenreService],
})
export class GenreModule {}
