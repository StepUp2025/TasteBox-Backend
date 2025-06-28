import type { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { ExternalApiException } from 'src/common/exceptions/external-api-exception';
import { ContentType } from './../common/types/content-type.enum';
import { buildTmdbUrl, fetchFromTmdb } from '../common/utils/tmdb.utils';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import type { GenreRepository } from './genre.repository';
import type { TMDBGenreListResponse } from './interfaces/genre.interface';
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
      const { data, error } = await fetchFromTmdb<TMDBGenreListResponse>(
        this.httpService,
        url,
        this.configService,
      );
      if (error || !data) {
        throw new ExternalApiException();
      }
      for (const genre of data.genres) {
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
}
