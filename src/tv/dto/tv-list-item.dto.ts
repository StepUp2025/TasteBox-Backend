import { TMDBTvItem } from '../interfaces/tv-list.interface';

export class TvListItemDto {
  constructor(
    public id: number,
    public title: string,
    public poster_path: string,
  ) {}

  static fromTMDB(raw: TMDBTvItem): TvListItemDto {
    return new TvListItemDto(raw.id, raw.name, raw.poster_path);
  }
}
