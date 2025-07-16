import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from 'src/genre/genre.module';
import { TvSeries } from './entities/tv-series.entity';
import { TvSeriesRepository } from './repository/tv-series.repository';
import { TvSeriesController } from './tv-series.controller';
import { TvSeriesService } from './tv-series.service';

@Module({
  imports: [TypeOrmModule.forFeature([TvSeries]), GenreModule],
  controllers: [TvSeriesController],
  providers: [TvSeriesService, TvSeriesRepository],
  exports: [TvSeriesService, TvSeriesRepository],
})
export class MovieModule {}
