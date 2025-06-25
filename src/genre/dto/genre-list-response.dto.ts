import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { GenreDto } from './genre.dto';
import { plainToInstance } from 'class-transformer';
import { Genre } from '../entity/genre.entity';

export class GenreListResponseDto {
  @ApiProperty({ type: [GenreDto], description: '장르 목록' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  @Expose()
  genres: GenreDto[];

  @ApiProperty({ example: 2, description: '총 장르 개수' })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  count: number;

  static fromGenres(genres: Genre[]): GenreListResponseDto {
    const genreDtos = plainToInstance(GenreDto, genres, {
      excludeExtraneousValues: true,
    });

    return plainToInstance(
      GenreListResponseDto,
      {
        genres: genreDtos,
        count: genreDtos.length,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
