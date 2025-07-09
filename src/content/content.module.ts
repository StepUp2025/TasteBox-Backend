import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentGenre } from 'src/content/entities/content-genre.entity';
import { Genre } from 'src/genre/entity/genre.entity';
import { Content } from './entities/content.entity';
import { SyncStatus } from './entities/sync-status.entity';
import { Movie } from './movie/entities/movie.entity';
import { MovieController } from './movie/movie.controller';
import { MovieService } from './movie/movie.service';
import { MovieRepository } from './movie/repository/movie.repository';
import { TvSeason } from './tv/entities/tv-season.entity';
import { Tv } from './tv/entities/tv-series.entity';
import { TvRepository } from './tv/repository/tv.repository';
import { TvController } from './tv/tv.controller';
import { TvService } from './tv/tv.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Content,
      ContentGenre,
      Movie,
      Tv,
      TvSeason,
      Genre,
      SyncStatus,
    ]),
  ],
  controllers: [MovieController, TvController],
  providers: [MovieService, MovieRepository, TvService, TvRepository],
  exports: [TypeOrmModule],
})
export class ContentModule {}
