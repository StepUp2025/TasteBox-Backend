import { ContentType } from 'src/common/enums/content-type.enum';
import { PreferenceDetailDto } from './preference-detail.dto';

export class GetPreferenceResponseDto {
  [key: string]: PreferenceDetailDto;

  constructor(data: { [key in ContentType]?: PreferenceDetailDto }) {
    for (const key in ContentType) {
      const enumValue = ContentType[key as keyof typeof ContentType];
      this[enumValue as ContentType] = (data[enumValue] ||
        new PreferenceDetailDto([], 0)) as PreferenceDetailDto;
    }
  }
}
