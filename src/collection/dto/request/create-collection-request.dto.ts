import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionRequestDto {
  @ApiProperty({
    description: '컬렉션의 제목',
    example: '최고의 영화 & 시리즈 모음',
  })
  @IsNotEmpty({ message: '제목을 입력해 주세요' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: '컬렉션 설명',
    example: '내가 좋아하는 영화랑 TV 시리즈!',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: '컬렉션 이미지 파일',
  })
  @IsOptional()
  thumbnail?: any;
  /*
    썸네일 이미지 파일 업로드용 필드입니다. 
    문서화 및 Swagger UI에서 파일 업로드 필드를 노출하기 위해 any 타입으로 선언했습니다.
    일반적으로 DTO에는 파일을 직접 두지 않지만, Swagger 문서화 및 파일 업로드 지원을 위해 추가합니다.
  **/
}
