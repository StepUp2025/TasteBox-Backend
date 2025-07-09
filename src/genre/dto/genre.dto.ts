import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Genre } from './../entity/genre.entity';

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

  @ApiProperty({ example: '🔥', description: '장르 이모지' })
  @IsString()
  @Expose()
  emoji: string;

  static of(genre: Genre): GenreDto {
    return {
      id: genre.id,
      name: genre.name,
      emoji: 'emoji',
    };
  }
}
