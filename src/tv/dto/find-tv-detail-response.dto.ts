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
  title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  poster_path: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  backdrop_path: string | null;

  @ApiProperty()
  adult: boolean;

  @ApiProperty()
  original_language: string;

  @ApiProperty({ type: [String] })
  languages: string[];

  @ApiProperty()
  in_production: boolean;

  @ApiProperty({ type: [Object] })
  genres: { id: number; name: string }[];

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  first_air_date: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  last_air_date: string | null;

  @ApiProperty()
  popularity: number;

  @ApiProperty()
  vote_average: number;

  @ApiProperty()
  vote_count: number;

  @ApiProperty()
  number_of_seasons: number;

  @ApiProperty()
  number_of_episodes: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string | null;
    name: string;
    title: string;
    vote_average: number;
  }[];

  // TMDB 응답 객체 -> FindTvDetailResponseDto 변환 메서드
  static of(raw: TMDBTvDetailResponse): FindTvDetailResponseDto {
    return {
      id: raw.id,
      title: raw.name,
      overview: raw.overview,
      poster_path: raw.poster_path,
      backdrop_path: raw.backdrop_path,
      adult: raw.adult,
      original_language: raw.original_language,
      languages: raw.languages,
      in_production: raw.in_production,
      genres: raw.genres.map((g: TMDBGenre) => ({ id: g.id, name: g.name })),
      status: raw.status,
      first_air_date: raw.first_air_date,
      last_air_date: raw.last_air_date,
      popularity: raw.popularity,
      vote_average: raw.vote_average,
      vote_count: raw.vote_count,
      number_of_seasons: raw.number_of_seasons,
      number_of_episodes: raw.number_of_episodes,
      seasons: raw.seasons.map((s: TMDBTvSeason) => ({
        id: s.id,
        season_number: s.season_number,
        episode_count: s.episode_count,
        poster_path: s.poster_path,
        air_date: s.air_date,
        name: s.name,
        title: s.name,
        vote_average: s.vote_average,
      })),
    };
  }
}
