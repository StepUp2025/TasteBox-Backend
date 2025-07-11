import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ContentGenre } from 'src/content/entities/content-genre.entity';
import { Genre } from 'src/genre/entities/genre.entity';

export class GenreInContentResponseDto {
  @Expose()
  @ApiProperty({ description: '장르 고유 ID', example: 27 })
  id: number;

  @Expose()
  @ApiProperty({ description: '장르 이름', example: '공포' })
  name: string;

  constructor(genre: Genre) {
    this.id = genre.id;
    this.name = genre.name;
  }

  static fromContentGenres(
    contentGenres: ContentGenre[],
  ): GenreInContentResponseDto[] {
    // 1. 입력 유효성 검사 및 초기화
    if (!contentGenres || !Array.isArray(contentGenres)) {
      return [];
    }
    // 2. ContentGenre 배열 순회, GenreInContentResponseDto로 변환
    return (
      contentGenres
        .map((contentGenre: ContentGenre) => {
          // 2-1. 실제 Genre 엔티티 추출
          const genreEntity = Array.isArray(contentGenre.genre)
            ? contentGenre.genre[0]
            : contentGenre.genre;

          // 2-2. 추출된 Genre 엔티티 유효성 검사
          if (
            genreEntity &&
            genreEntity.id !== undefined &&
            genreEntity.name !== undefined
          ) {
            // 2-3. 유효한 Genre 엔티티로 GenreInContentResponseDto 인스턴스 생성
            return new GenreInContentResponseDto(genreEntity);
          }
          return null;
        })
        // 3. null 값 필터링
        .filter(Boolean) as GenreInContentResponseDto[]
    );
  }
}
