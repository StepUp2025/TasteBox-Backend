import { ContentType } from 'src/common/enums/content-type.enum';
import { PreferenceDetailDto } from './preference-detail.dto';

export class GetPreferenceResponseDto {
  [key: string]: PreferenceDetailDto;

  constructor(data: { [key in ContentType]?: PreferenceDetailDto }) {
    data = data || {};

    for (const key in ContentType) {
      if (Object.hasOwn(ContentType, key)) {
        const enumValue = ContentType[key as keyof typeof ContentType];
        if (typeof enumValue === 'string') {
          this[enumValue as ContentType] = (data[enumValue] ||
            new PreferenceDetailDto([], 0)) as PreferenceDetailDto;
        }
      }
    }
  }
}
