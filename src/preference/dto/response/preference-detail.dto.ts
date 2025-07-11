import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from 'src/common/enums/content-type.enum';
import { Genre } from 'src/genre/entities/genre.entity';
import { GenreWithEmojiDto } from './../../../genre/dto/genre-with-emoji.dto';
import { Preference } from './../../entities/preference.entity';

export class PreferenceDetailDto {
  @ApiProperty({
    description: '선호 장르 목록',
    type: [GenreWithEmojiDto],
  })
  genres: GenreWithEmojiDto[];

  @ApiProperty({
    description: '선호 장르 개수',
    example: 3,
  })
  count: number;

  constructor(genres: GenreWithEmojiDto[], count: number) {
    this.genres = genres;
    this.count = count;
  }

  static of(
    preferences: Preference[],
    contentType: ContentType,
  ): PreferenceDetailDto {
    const filteredAndMappedGenres: GenreWithEmojiDto[] = preferences
      .filter((p) => p.genre && p.genre.type === contentType)
      .map((p) => {
        const genre = p.genre as Genre;
        return GenreWithEmojiDto.ofWithEmoji(genre, contentType);
      })
      .sort((a, b) => a.id - b.id);

    return new PreferenceDetailDto(
      filteredAndMappedGenres,
      filteredAndMappedGenres.length,
    );
  }
}
