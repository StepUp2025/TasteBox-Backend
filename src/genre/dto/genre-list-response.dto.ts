import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ContentType } from 'src/common/enums/content-type.enum';
import type { Genre } from '../entities/genre.entity';
import { GenreDto } from './genre.dto';
import { GenreWithEmojiDto } from './genre-with-emoji.dto';

export class GenreListResponseDto {
  @ApiProperty({ type: [GenreDto], description: '장르 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  @Expose()
  genres: GenreDto[];

  @ApiProperty({ example: 2, description: '총 장르 개수' })
  @IsNumber()
  @Expose()
  count: number;

  @ApiProperty({
    enum: ContentType,
    description: '콘텐츠 타입',
    example: ContentType.MOVIE,
  })
  @Expose()
  type: ContentType;

  constructor(
    genres: GenreWithEmojiDto[],
    count: number,
    contentType: ContentType,
  ) {
    this.type = contentType;
    this.genres = genres;
    this.count = count;
  }

  static of(
    genres: Genre[],
    count: number,
    contentType: ContentType,
  ): GenreListResponseDto {
    const genreDtosWithEmoji: GenreWithEmojiDto[] = genres
      .map((genre) => GenreWithEmojiDto.ofWithEmoji(genre, contentType))
      .sort((a, b) => a.id - b.id);

    return new GenreListResponseDto(genreDtosWithEmoji, count, contentType);
  }
}
