import { Injectable } from '@nestjs/common';
import { ContentType } from 'src/common/enums/content-type.enum';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { UpdatePreferenceRequestDto } from './dto/request/update-preference-request.dto';
import { GetPreferenceResponseDto } from './dto/response/get-preferences-response.dto';
import { PreferenceDetailDto } from './dto/response/preference-detail.dto';
import { PreferenceRepository } from './repository/preference.repository';

@Injectable()
export class PreferenceService {
  constructor(
    private readonly preferenceRepository: PreferenceRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  // 취향 설정
  async updateUserPreferences(
    userId: number,
    updateDto: UpdatePreferenceRequestDto,
  ): Promise<void> {
    const user = await this.userService.getOrThrowById(userId);
    await this.preferenceRepository.updateUserPreferences(user, updateDto);
  }

  // 전체 취향 조회
  async getUserPreferences(userId: number): Promise<GetPreferenceResponseDto> {
    const user = await this.userService.getOrThrowById(userId);

    const preferencePromises: Promise<PreferenceDetailDto>[] = [];
    const preferenceData: { [key: string]: PreferenceDetailDto } = {};
    for (const key in ContentType) {
      const enumValue = ContentType[key as keyof typeof ContentType]; // "MOVIE", "TVSERIES"
      preferencePromises.push(
        this.preferenceRepository.getPreferencesByContentType(user, enumValue),
      );
    }

    // 비동기 조회 작업 동시 실행
    const results = await Promise.all(preferencePromises);
    let index = 0;
    for (const key in ContentType) {
      const enumValue = ContentType[key as keyof typeof ContentType];
      preferenceData[enumValue] = results[index];
      index++;
    }
    return new GetPreferenceResponseDto(
      preferenceData as { [key in ContentType]?: PreferenceDetailDto },
    );
  }

  // 컨텐츠별 취향 조회
  async getPreferencesByContentType(
    userId: number,
    contentType: ContentType,
  ): Promise<PreferenceDetailDto> {
    const user = await this.userService.getOrThrowById(userId);
    return this.preferenceRepository.getPreferencesByContentType(
      user,
      contentType,
    );
  }
}
