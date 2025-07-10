import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TvSeason } from '../entities/tv-season.entity';

export class TvSeasonResponseDto {
  @ApiProperty({ description: '시즌 고유 ID', example: 121288 })
  @Expose()
  id: number;

  @ApiProperty({ description: '시즌 번호', example: 1 })
  @Expose()
  seasonNumber: number | null;

  @ApiProperty({ description: '총 에피소드 수', example: 10 })
  @Expose()
  episodeCount: number | null;

  @ApiProperty({
    description: '시즌 포스터 이미지 경로',
    example: '/path/to/season_poster.jpg',
    nullable: true,
  })
  @Expose()
  posterPath: string | null;

  @ApiProperty({
    description: '첫 방영일',
    example: '2011-04-17',
    nullable: true,
  })
  @Expose()
  airDate: string | null;

  @ApiProperty({ description: '시즌 이름', example: 'Season 1' })
  @Expose()
  name: string | null;

  @ApiProperty({
    description: '시즌 제목',
    example: 'Season 1',
    nullable: true,
  })

  @ApiProperty({ description: '평균 평점', example: 8.4, nullable: true })
  @Expose()
  voteAverage: number | null;

  constructor(season: TvSeason) {
    this.id = season.id;
    this.seasonNumber = season.seasonNumber;
    this.episodeCount = season.episodeCount;
    this.posterPath = season.posterPath;
    this.airDate =
      season.airDate instanceof Date
        ? season.airDate.toISOString().split('T')[0]
        : season.airDate;
    this.name = season.name;
    this.voteAverage = season.voteAverage;
  }

  static fromTvSeason(tvSeasons: TvSeason[]): TvSeasonResponseDto[] {
    if (!tvSeasons || !Array.isArray(tvSeasons)) {
      return [];
    }
    return tvSeasons
      .map((season) => {
        if (season && season.id !== undefined) {
          return new TvSeasonResponseDto(season);
        }
        return null;
      })
      .filter(Boolean) as TvSeasonResponseDto[];
  }
}
