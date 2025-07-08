import { Injectable } from '@nestjs/common';
import { ContentType } from './../common/types/content-type.enum';
import { GenreListResponseDto } from './dto/genre-list-response.dto';
import { GenreRepository } from './repository/genre.repository';

@Injectable()
export class GenreService {
  constructor(private readonly genreRepository: GenreRepository) {}

  async getGenres(contentType: ContentType): Promise<GenreListResponseDto> {
    const [genres, count] = await this.genreRepository.getGenres(contentType);
    return GenreListResponseDto.of(genres, count);
  }
}
