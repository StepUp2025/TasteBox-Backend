import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from 'src/common/enums/content-type.enum';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { GenreService } from './../genre/genre.service';
import { UpdatePreferenceRequestDto } from './dto/request/update-preference-request.dto';
import { GetPreferenceResponseDto } from './dto/response/get-preferences-response.dto';
import { PreferenceDetailDto } from './dto/response/preference-detail.dto';
import { Preference } from './entities/preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,

    private readonly dataSource: DataSource,

    private readonly userService: UserService,
    private readonly genreService: GenreService,
  ) {}

  async updateUserPreferences(
    userId: number,
    dto: UpdatePreferenceRequestDto,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.getOrThrowById(userId);
      const genreIds = this.extractGenreIds(dto);

      await manager.getRepository(Preference).delete({ user: { id: userId } });

      if (genreIds.length === 0) return;

      const genres = await this.genreService.getGenresByIds(genreIds);
      const preferences = this.createPreferences(user, genres);
      await manager.getRepository(Preference).save(preferences);
    });
  }

  // 전체 취향 조회
  async getUserPreferences(userId: number): Promise<GetPreferenceResponseDto> {
    await this.userService.getOrThrowById(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return {
      movie: this.buildPreferenceDetail(preferences, ContentType.MOVIE),
      tv: this.buildPreferenceDetail(preferences, ContentType.TVSERIES),
    };
  }

  // 회원 영화 취향 조회
  async getMoviePreferences(userId: number): Promise<PreferenceDetailDto> {
    await this.userService.getOrThrowById(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return this.buildPreferenceDetail(preferences, ContentType.MOVIE);
  }

  // 회원 TV 취향 정보 조회
  async getTvPreferences(userId: number): Promise<PreferenceDetailDto> {
    await this.userService.getOrThrowById(userId);
    const preferences = await this.getPreferencesByUserId(userId);
    return this.buildPreferenceDetail(preferences, ContentType.TVSERIES);
  }

  // GenreId 추출
  private extractGenreIds(dto: UpdatePreferenceRequestDto): number[] {
    const movieGenreIds = dto.movie?.genreIds ?? [];
    const tvGenreIds = dto.tv?.genreIds ?? [];
    return [...movieGenreIds, ...tvGenreIds];
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
    return PreferenceDetailDto.of(preferences, contentType);
  }
}
