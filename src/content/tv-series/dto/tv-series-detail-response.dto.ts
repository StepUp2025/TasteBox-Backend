import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { ContentType } from 'src/common/enums/content-type.enum';
import { TvSeriesStatus } from 'src/content/enum/tv-series-status.enum';
import { GenreDto } from 'src/genre/dto/genre.dto';
import { TvSeries } from '../entities/tv-series.entity';
import { TvSeasonResponseDto } from './tv-season-response.dto';

export class TvSeriesDetailResponseDto {
  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 고유 식별자',
    example: 1399,
  })
  id: number;

  @Expose()
  contentType: ContentType;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 제목 (기본 언어)',
    example: 'Game of Thrones',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈에 대한 간략한 줄거리 요약',
    example:
      'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.',
  })
  overview: string | null;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 포스터 이미지 경로',
    example: '/poster_path_example.jpg',
    nullable: true,
    required: false,
  })
  @IsOptional()
  posterPath: string | null;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 배경 이미지 경로',
    example: '/backdrop_path_example.jpg',
    nullable: true,
    required: false,
  })
  @IsOptional()
  backdropPath: string | null;

  @ApiProperty({
    description: '성인 콘텐츠 여부',
    example: false,
  })
  adult: boolean;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 원본 언어 코드',
    example: 'en',
  })
  originalLanguage: string | null;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 방영 언어 목록',
    type: [String],
    example: ['English', 'French'],
  })
  languages: string[];

  @Expose()
  @ApiProperty({
    description: '현재 제작 중인 TV 시리즈인지 여부',
    example: false,
  })
  inProduction: boolean;

  @Expose()
  @ApiProperty({ description: 'TV 시리즈에 할당된 장르 목록', type: [Object] })
  @Type(() => GenreDto)
  genres: GenreDto[];

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 현재 상태 (예: Returning Series, Ended)',
    enum: TvSeriesStatus,
    example: 'Ended',
  })
  status: TvSeriesStatus | null;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 첫 방영일',
    example: '2011-04-17',
    nullable: true,
    required: false,
  })
  @IsOptional()
  firstAirDate: Date | null;

  @Expose()
  @ApiProperty({
    description: 'TV 시리즈의 마지막 방영일',
    example: '2019-05-19',
    nullable: true,
    required: false,
  })
  @IsOptional()
  lastAirDate: Date | null;

  @Expose()
  @ApiProperty({
    description: 'TMDB에서 계산된 인기도 점수',
    example: 300.556,
  })
  popularity: number | null;

  @Expose()
  @ApiProperty({
    description: '사용자 투표 기반 평균 평점 (0-10)',
    example: 8.4,
  })
  voteAverage: number | null;

  @Expose()
  @ApiProperty({
    description: '총 투표 수',
    example: 20000,
  })
  voteCount: number | null;

  @Expose()
  @ApiProperty({
    description: '총 시즌 수',
    example: 8,
  })
  numberOfSeasons: number | null;

  @Expose()
  @ApiProperty()
  numberOfEpisodes: number | null;
  @Expose()

  @ApiProperty({ type: [TvSeasonResponseDto], description: '시즌 목록' })
  @IsArray()
  @Type(() => TvSeasonResponseDto)
  seasons: TvSeasonResponseDto[];

  constructor(tv: TvSeries) {
    this.id = tv.id;
    this.contentType = tv.type;
    this.title = tv.title;
    this.overview = tv.overview;
    this.posterPath = tv.posterPath;
    this.backdropPath = tv.backdropPath;
    this.originalLanguage = tv.originalLanguage;
    this.status = tv.status;
    this.firstAirDate = tv.firstAirDate;
    this.lastAirDate = tv.lastAirDate;
    this.popularity = tv.popularity;
    this.voteAverage = tv.voteAverage;
    this.voteCount = tv.voteCount;
    this.numberOfSeasons = tv.numberOfSeasons;
    this.numberOfEpisodes = tv.numberOfEpisodes;
    this.adult = tv.adult;
    this.genres = tv.contentGenres
      .filter((cg) => cg.genre)
      .map((cg) => GenreDto.of(cg.genre));
    this.seasons = TvSeasonResponseDto.fromTvSeason(tv.tvSeasons);
  }
}
