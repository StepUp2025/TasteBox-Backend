import { TMDBMovie } from '../type/movie-list';

export class MovieListItemDto {
  constructor(
    public id: number,
    public title: string,
    public poster_path: string,
  ) {}

  static fromTMDBMovie(raw: TMDBMovie): MovieListItemDto {
    return new MovieListItemDto(raw.id, raw.title, raw.poster_path);
  }
}
