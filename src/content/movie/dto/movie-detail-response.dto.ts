import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ContentType } from 'src/common/types/content-type.enum';
import { MovieStatus } from 'src/content/enum/movie-status.enum';
import { GenreInContentResponseDto } from 'src/genre/dto/genre-in-content-response.dto';
import { Movie } from './../entities/movie.entity';

export class MovieDetailResponseDto {
  @Expose()
  @ApiProperty({ description: '영화의 고유 ID', example: 574475 })
  id: number;

  @Expose()
  @ApiProperty({ description: '콘텐츠 타입', example: ContentType.MOVIE })
  contentType: ContentType;

  @Expose()
  @ApiProperty({
    description: '영화 제목',
    example: '파이널 데스티네이션 블러드라인스',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: '영화 줄거리 요약',
    example:
      '악몽에 시달리던 대학생 스테파니는 가족의 끔찍한 죽음을 막기 위해...',
  })
  overview: string | null;

  @Expose()
  @ApiProperty({
    description: '영화 포스터 이미지 경로',
    example: '/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg',
  })
  posterPath: string | null;

  @Expose()
  @ApiProperty({
    description: '영화 배경 이미지 경로',
    example: '/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg',
  })
  backdropPath: string | null;

  @Expose()
  @ApiProperty({ description: '성인 관람가 여부', example: false })
  adult: boolean;

  @Expose()
  @ApiProperty({ description: '원본 언어', example: 'en' })
  originalLanguage: string | null;

  @Expose()
  @ApiProperty({
    description: '영화 장르 목록',
    type: [GenreInContentResponseDto],
    example: [
      { id: 27, name: '공포' },
      { id: 9648, name: '미스터리' },
    ],
  })
  @Type(() => GenreInContentResponseDto)
  genres: GenreInContentResponseDto[];

  @Expose()
  @ApiProperty({
    description: '영화의 현재 상태 (예: Released, Rumored)',
    enum: MovieStatus,
    example: 'Released',
  })
  status: string | null;

  @Expose()
  @ApiProperty({
    description: '영화 상영 시간 (분)',
    example: 90,
  })
  runtime: number | null;

  @Expose()
  @ApiProperty({ description: '인기도 점수', example: 1124.222 })
  popularity: number | null;

  @Expose()
  @ApiProperty({ description: '개봉일 (YYYY-MM-DD)', example: '2025-05-14' })
  releaseDate: Date | null;

  @Expose()
  @ApiProperty({ description: '평균 평점', example: 7.219 })
  voteAverage: number | null;

  @Expose()
  @ApiProperty({ description: '투표 수', example: 1147 })
  voteCount: number | null;

  constructor(movie: Movie) {
    this.id = movie.id;
    this.contentType = movie.type;
    this.overview = movie.overview;
    this.title = movie.displayTitle;
    this.posterPath = movie.posterPath;
    this.backdropPath = movie.backdropPath;
    this.voteAverage = movie.voteAverage;
    this.voteCount = movie.voteCount;
    this.popularity = movie.popularity;
    this.releaseDate = movie.releaseDate;
    this.runtime = movie.runtime;
    this.status = movie.status;
    this.originalLanguage = movie.originalLanguage;
    this.adult = movie.adult;
    this.genres = GenreInContentResponseDto.fromContentGenres(
      movie.contentGenres,
    );
  }
}
