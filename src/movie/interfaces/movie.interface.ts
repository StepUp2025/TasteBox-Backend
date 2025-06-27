import {
  TMDBGenre,
  TMDBSpokenLanguage,
  TMDBProductionCompany,
} from '../../common/interfaces/tmdb-common.interface';

export interface TMDBMovieDetailResponse {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  genres: TMDBGenre[];
  popularity: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  runtime: number;
  status: string;
  adult: boolean;
  video: boolean;
  spoken_languages: TMDBSpokenLanguage[];
  production_companies: TMDBProductionCompany[];
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
}
