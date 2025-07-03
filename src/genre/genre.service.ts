import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentType } from './../common/types/content-type.enum';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { GenreNotFoundException } from './../preference/exceptions/genre-not-found.exception';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { Genre } from './entity/genre.entity';
import { GenreRepository } from './genre.repository';
import { TMDBGenreListResponse } from './interfaces/genre.interface';
import { mapGenreToEmoji } from './utils/genre-emoji-mapper.util';

@Injectable()
export class GenreService {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // TMDB로부터 장르 가져와 저장
  async syncAllGenresFromTMDB(): Promise<void> {
    const endpoints = [
      { path: '/genre/movie/list', type: ContentType.MOVIE },
      { path: '/genre/tv/list', type: ContentType.TV },
    ];

    for (const { path, type } of endpoints) {
      const url = buildTmdbUrl(path);
      const tmdbData = await fetchFromTmdb<TMDBGenreListResponse>(
        this.httpService,
        url,
        this.configService,
      );

      for (const genre of tmdbData.genres) {
        await this.genreRepository.upsertGenre(
          genre.id.toString(),
          genre.name,
          mapGenreToEmoji(genre.name),
          type,
        );
      }
    }
  }

  // TMDB 장르 반환
  async getGenresResponse(
    contentType: ContentType,
  ): Promise<GenreListResponseDto> {
    const genreEntities =
      await this.genreRepository.findByContentType(contentType);
    return GenreListResponseDto.of(genreEntities);
  }

  async getGenresOrThrow(ids: string[]): Promise<Genre[]> {
    const genres = await this.genreRepository.findByIds(ids);
    if (genres.length !== ids.length) {
      throw new GenreNotFoundException();
    }
    return genres;
  }
}
