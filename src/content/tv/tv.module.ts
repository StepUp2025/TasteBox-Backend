import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ContentModule } from './../content.module';
import { TvRepository } from './repository/tv.repository';
import { TvController } from './tv.controller';
import { TvService } from './tv.service';

@Module({
  imports: [ContentModule, HttpModule],
  controllers: [TvController],
  providers: [TvService, TvRepository],
})
export class TvModule {}
