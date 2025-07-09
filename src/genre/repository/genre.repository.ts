import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from 'src/common/enums/content-type.enum';
import { In, Repository } from 'typeorm';
import { ContentNotFoundException } from './../../content/exception/content-not-found.exception';
import { Genre } from '../entity/genre.entity';

@Injectable()
export class GenreRepository {
  constructor(
    @InjectRepository(Genre)
    private readonly repository: Repository<Genre>,
  ) {}

  async getGenres(contentType: ContentType): Promise<[Genre[], number]> {
    const [genres, count] = await this.repository.findAndCount({
      where: { type: contentType },
      order: { name: 'ASC' },
    });
    if (!genres || count === 0) throw new ContentNotFoundException();
    return [genres, count];
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
