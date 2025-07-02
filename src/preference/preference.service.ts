import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from 'src/common/types/content-type.enum';
import { GenreDto } from 'src/genre/dto/genre.dto';
import { Genre } from 'src/genre/entity/genre.entity';
import { User } from 'src/user/user.entity';
import { In, Repository } from 'typeorm';
import { UserNotFoundException } from './../user/exceptions/user-not-found.exception';
import { UpdatePreferenceRequestDto } from './dto/request/update-preference-request.dto';
import { GetPreferenceResponseDto } from './dto/response/get-preferences-response.dto';
import { PreferenceDetailDto } from './dto/response/preference-detail.dto';
import { GenreNotFoundException } from './exceptions/genre-not-found.exception';
import { Preference } from './preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async updateUserPreferences(
    userId: number,
    dto: UpdatePreferenceRequestDto,
  ): Promise<void> {
    const user = await this.getUserOrThrow(userId);
    const genreIds = this.extractGenreIds(dto);
    await this.preferenceRepository.delete({ user: { id: userId } });
    if (genreIds.length === 0) return;

    const genres = await this.getGenresOrThrow(genreIds);
    const preferences = this.createPreferences(user, genres);
    await this.preferenceRepository.save(preferences);
  }

  // 전체 취향 조회
  async getUserPreferences(userId: number): Promise<GetPreferenceResponseDto> {
    await this.getUserOrThrow(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return {
      movie: this.buildPreferenceDetail(preferences, ContentType.MOVIE),
      tv: this.buildPreferenceDetail(preferences, ContentType.TV),
    };
  }

  // 회원 영화 취향 조회
  async getMoviePreferences(userId: number): Promise<PreferenceDetailDto> {
    await this.getUserOrThrow(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return this.buildPreferenceDetail(preferences, ContentType.MOVIE);
  }

  // 회원 TV 취향 정보 조회
  async getTvPreferences(userId: number): Promise<PreferenceDetailDto> {
    await this.getUserOrThrow(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return this.buildPreferenceDetail(preferences, ContentType.TV);
  }

  // GenreId 추출
  private extractGenreIds(dto: UpdatePreferenceRequestDto): number[] {
    const movieGenreIds = dto.movie?.genreIds ?? [];
    const tvGenreIds = dto.tv?.genreIds ?? [];
    return [...movieGenreIds, ...tvGenreIds];
  }

  // User 검증
  private async getUserOrThrow(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  // Genre 존재 검증
  private async getGenresOrThrow(genreIds: number[]): Promise<Genre[]> {
    const genres = await this.genreRepository.findBy({ id: In(genreIds) });
    if (genres.length !== genreIds.length) throw new GenreNotFoundException();
    return genres;
  }

  // Preference 생성
  private createPreferences(user: User, genres: Genre[]): Preference[] {
    return genres.map((genre) =>
      this.preferenceRepository.create({ user, genre }),
    );
  }

  private async getPreferencesByUserId(userId: number): Promise<Preference[]> {
    return this.preferenceRepository.find({
      where: { user: { id: userId } },
      relations: ['genre'],
    });
  }

  // contentType 기준 분기하여 응답 DTO 생성
  private buildPreferenceDetail(
    preferences: Preference[],
    contentType: ContentType,
  ): PreferenceDetailDto {
    const genres = preferences
      .filter((p) => p.genre.contentType === contentType)
      .map((p) => GenreDto.of(p.genre));

    return {
      genres,
      count: genres.length,
    };
  }
}
