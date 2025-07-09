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
import { TvSeason } from './tv-series/entities/tv-season.entity';
import { TvSeries } from './tv-series/entities/tv-series.entity';
import { TvSeriesRepository } from './tv-series/repository/tv-series.repository';
import { TvSeriesController } from './tv-series/tv-series.controller';
import { TvSeriesService } from './tv-series/tv-series.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Content,
      ContentGenre,
      Movie,
      TvSeries,
      TvSeason,
      Genre,
      SyncStatus,
    ]),
  ],
  controllers: [MovieController, TvSeriesController],
  providers: [
    MovieService,
    MovieRepository,
    TvSeriesService,
    TvSeriesRepository,
  ],
  exports: [TypeOrmModule],
})
export class ContentModule {}
