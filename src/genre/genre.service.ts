import { Injectable } from '@nestjs/common';
import { ContentType } from './../common/enums/content-type.enum';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { Genre } from './entities/genre.entity';
import { GenreNotFoundException } from './exceptions/genre-not-found.exception';
import { GenreRepository } from './repository/genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async getGenresByType(
    contentType: ContentType,
  ): Promise<GenreListResponseDto> {
    const [genres, count] =
      await this.genreRepository.getGenresByType(contentType);
    if (!genres || count === 0) throw new GenreNotFoundException();
    return GenreListResponseDto.of(genres, count, contentType);
  }

  async getGenresByIds(genreIds: number[]): Promise<Genre[]> {
    if (genreIds.length === 0) {
      return [];
    }
    const genres = await this.genreRepository.getGenresByIds(genreIds);
    return genres;
  }
}
