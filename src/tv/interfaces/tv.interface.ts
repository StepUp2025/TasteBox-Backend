import type {
  TMDBGenre,
  TMDBProductionCompany,
  TMDBProductionCountry,
  TMDBSpokenLanguage,
} from '../../common/interfaces/tmdb-common.interface';

export interface TMDBTvCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface TMDBTvEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface TMDBTvSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TMDBTvDetailResponse {
  adult: boolean;
  backdrop_path: string | null;
  created_by: TMDBTvCreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TMDBGenre[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string | null;
  last_episode_to_air: TMDBTvEpisodeToAir | null;
  name: string;
  next_episode_to_air: TMDBTvEpisodeToAir | null;
  networks: any[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  seasons: TMDBTvSeason[];
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
