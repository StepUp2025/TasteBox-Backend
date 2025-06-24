import { TMDBMovieDetailResponse } from '../interfaces/movie.interface';
import { ApiProperty } from '@nestjs/swagger';

export class FindMovieDetailResponseDto {
  @ApiProperty({ description: '영화의 고유 ID', example: 574475 })
  id: number;

  @ApiProperty({
    description: '영화 제목',
    example: '파이널 데스티네이션 블러드라인스',
  })
  title: string;

  @ApiProperty({
    description: '영화 줄거리 요약',
    example:
      '악몽에 시달리던 대학생 스테파니는 가족의 끔찍한 죽음을 막기 위해...',
  })
  overview: string;

  @ApiProperty({
    description: '영화 포스터 이미지 경로',
    example: '/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg',
  })
  poster_path: string;

  @ApiProperty({
    description: '영화 배경 이미지 경로',
    example: '/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg',
  })
  backdrop_path: string;

  @ApiProperty({ description: '성인 관람가 여부', example: false })
  adult: boolean;

  @ApiProperty({ description: '원본 언어', example: 'en' })
  original_language: string;

  @ApiProperty({
    description: '영화 장르 목록',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 27 },
        name: { type: 'string', example: '공포' },
      },
    },
    example: [
      { id: 27, name: '공포' },
      { id: 9648, name: '미스터리' },
    ],
  })
  genres: { id: number; name: string }[];

  @ApiProperty({
    description: '영화의 현재 상태 (예: Released, Rumored)',
    example: 'Released',
  })
  status: string;

  @ApiProperty({ description: '영화 상영 시간 (분)', example: 90 })
  runtime: number;

  @ApiProperty({ description: '인기도 점수', example: 1124.222 })
  popularity: number;

  @ApiProperty({ description: '개봉일 (YYYY-MM-DD)', example: '2025-05-14' })
  release_date: string;

  @ApiProperty({ description: '평균 평점', example: 7.219 })
  vote_average: number;

  @ApiProperty({ description: '투표 수', example: 1147 })
  vote_count: number;

  constructor(
    id: number,
    title: string,
    overview: string,
    poster_path: string,
    backdrop_path: string,
    adult: boolean,
    original_language: string,
    genres: { id: number; name: string }[],
    status: string,
    runtime: number,
    popularity: number,
    release_date: string,
    vote_average: number,
    vote_count: number,
  ) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.poster_path = poster_path;
    this.backdrop_path = backdrop_path;
    this.adult = adult;
    this.original_language = original_language;
    this.genres = genres;
    this.status = status;
    this.runtime = runtime;
    this.popularity = popularity;
    this.release_date = release_date;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
  }

  static fromTMDB(raw: TMDBMovieDetailResponse): FindMovieDetailResponseDto {
    return new FindMovieDetailResponseDto(
      raw.id,
      raw.title,
      raw.overview,
      raw.poster_path,
      raw.backdrop_path,
      raw.adult,
      raw.original_language,
      raw.genres,
      raw.status,
      raw.runtime,
      raw.popularity,
      raw.release_date,
      raw.vote_average,
      raw.vote_count,
    );
  }
}
