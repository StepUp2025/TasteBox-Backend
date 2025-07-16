import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from 'src/genre/genre.module';
import { Movie } from './entities/movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieRepository } from './repository/movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), GenreModule],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository],
  exports: [MovieService, MovieRepository],
})
export class MovieModule {}
