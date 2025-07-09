import { Injectable } from '@nestjs/common';
import { ContentType } from './../common/types/content-type.enum';
import { GenreNotFoundException } from './../preference/exceptions/genre-not-found.exception';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { Genre } from './entity/genre.entity';
import { GenreRepository } from './repository/genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async getGenres(contentType: ContentType): Promise<GenreListResponseDto> {
    const [genres, count] = await this.genreRepository.getGenres(contentType);
    return GenreListResponseDto.of(genres, count);
  }

  async getGenresOrThrow(ids: string[]): Promise<Genre[]> {
    const genres = await this.genreRepository.findByIds(ids);
    if (genres.length !== ids.length) {
      throw new GenreNotFoundException();
    }
    return genres;
  }
}
