import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ContentType } from 'src/common/enums/content-type.enum';
import { GENRE_EMOJI_MAP } from './../../common/constants/genre-emoji.constant';
import { Genre } from '../entities/genre.entity';
import { GenreDto } from './genre.dto';

export class GenreWithEmojiDto extends GenreDto {
  @ApiProperty({ example: '🔥', description: '장르 이모지' })
  @IsString()
  @Expose()
  emoji?: string;

  constructor(id: number, name: string, emoji?: string) {
    super(id, name);
    this.emoji = emoji;
  }

  static ofWithEmoji(
    genre: Genre,
    contentType: ContentType,
  ): GenreWithEmojiDto {
    const baseGenreDto = GenreDto.of(genre);

    let emoji: string | undefined;
    const emojiMapForType = GENRE_EMOJI_MAP[contentType];
    if (emojiMapForType) {
      emoji = emojiMapForType[baseGenreDto.name];
    }
    if (!emoji) {
      emoji = GENRE_EMOJI_MAP.DEFAULT;
    }

    return new GenreWithEmojiDto(baseGenreDto.id, baseGenreDto.name, emoji);
  }
}
