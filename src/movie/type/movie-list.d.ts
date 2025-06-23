export interface TMDBMovie {
  backdrop_path: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
}

export interface TMDBNowPlayingResponse {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}
