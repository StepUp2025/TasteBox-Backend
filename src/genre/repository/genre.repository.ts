import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from 'src/common/enums/content-type.enum';
import { In, Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';

@Injectable()
export class GenreRepository {
  constructor(
    @InjectRepository(Genre)
    private readonly repository: Repository<Genre>,
  ) {}

  async getGenresByType(contentType: ContentType): Promise<[Genre[], number]> {
    const [genres, count] = await this.repository.findAndCount({
      where: { type: contentType },
      order: { name: 'ASC' },
    });
    return [genres, count];
  }

  async getGenresByIds(genreIds: number[]): Promise<Genre[]> {
    if (genreIds.length === 0) {
      return [];
    }
    const genres = await this.repository.find({
      where: {
        id: In(genreIds),
      },
    });
    return genres;
  }
}
