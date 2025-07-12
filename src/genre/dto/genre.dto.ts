import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GENRE_NAME_KO_MAP } from './../../common/constants/genre-name-ko.constant';
import { Genre } from './../entities/genre.entity';

export class GenreDto {
  @ApiProperty({ example: 1, description: '장르 ID' })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ example: 'Action', description: '장르 이름' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(genre: Genre): GenreDto {
    const dbGenreName = genre.name;
    const displayGenreName = GENRE_NAME_KO_MAP.get(dbGenreName) || dbGenreName;

    return new GenreDto(genre.id, displayGenreName);
  }
}
