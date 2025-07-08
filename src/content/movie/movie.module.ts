import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ContentModule } from '../content.module';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieRepository } from './repository/movie.repository';

@Module({
  imports: [ContentModule, HttpModule],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository],
})
export class MovieModule {}
