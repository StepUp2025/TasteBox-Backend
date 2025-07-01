import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import type { TMDBGenre } from '../../common/interfaces/tmdb-common.interface';
import type {
  TMDBTvDetailResponse,
  TMDBTvSeason,
} from '../interfaces/tv.interface';

export class FindTvDetailResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  contentType: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  posterPath: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  backdropPath: string | null;

  @ApiProperty()
  adult: boolean;

  @ApiProperty()
  originalLanguage: string;

  @ApiProperty({ type: [String] })
  languages: string[];

  @ApiProperty()
  inProduction: boolean;

  @ApiProperty({ type: [Object] })
  genres: { id: number; name: string }[];

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  firstAirDate: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  lastAirDate: string | null;

  @ApiProperty()
  popularity: number;

  @ApiProperty()
  voteAverage: number;

  @ApiProperty()
  voteCount: number;

  @ApiProperty()
  numberOfSeasons: number;

  @ApiProperty()
  numberOfEpisodes: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  seasons: {
    id: number;
    seasonNumber: number;
    episodeCount: number;
    posterPath: string | null;
    airDate: string | null;
    name: string;
    title: string;
    voteAverage: number;
  }[];

  // TMDB 응답 객체 -> FindTvDetailResponseDto 변환 메서드
  static of(raw: TMDBTvDetailResponse): FindTvDetailResponseDto {
    return {
      id: raw.id,
      contentType: 'tv',
      title: raw.name,
      overview: raw.overview,
      posterPath: raw.poster_path,
      backdropPath: raw.backdrop_path,
      adult: raw.adult,
      originalLanguage: raw.original_language,
      languages: raw.languages,
      inProduction: raw.in_production,
      genres: raw.genres.map((g: TMDBGenre) => ({ id: g.id, name: g.name })),
      status: raw.status,
      firstAirDate: raw.first_air_date,
      lastAirDate: raw.last_air_date,
      popularity: raw.popularity,
      voteAverage: raw.vote_average,
      voteCount: raw.vote_count,
      numberOfSeasons: raw.number_of_seasons,
      numberOfEpisodes: raw.number_of_episodes,
      seasons: raw.seasons.map((s: TMDBTvSeason) => ({
        id: s.id,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        posterPath: s.poster_path,
        airDate: s.air_date,
        name: s.name,
        title: s.name,
        voteAverage: s.vote_average,
      })),
    };
  }
}
